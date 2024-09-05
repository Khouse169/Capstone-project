import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { useConfirm } from 'material-ui-confirm'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useSelector } from 'react-redux'
// import { BiChevronDown } from 'react-icons/bi';
// import { AiOutlineSearch } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { getStatus, uploadImage } from '~/apis'
import { createGroup, getGroupStatusForCreate, getGroupType } from '~/apis/groupApis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { DEFAULT_COVER } from '~/utils/constants'
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE, singleFileValidator } from '~/utils/validators'

function GroupCreate() {
  const [listStatus, setListStatus] = useState([])
  const [listGroupType, setListGroupType] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const [coverImage, setCoverImage] = useState(DEFAULT_COVER)
  const navigate = useNavigate()

  const { register, setValue, clearErrors, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      coverImage: DEFAULT_COVER
    }
  })

  // const backgroundStyle = !!coverImage && coverImage.length !== 0
  //   ? { backgroundImage: `url(${coverImage})`, backgroundPosition: 'center' }
  //   : {
  //     background: 'linear-gradient(to bottom, #E9EBEE 80%, #8b9dc3 100%)'
  //   }

  useEffect(() => {
    getGroupStatusForCreate().then(data => setListStatus(data))
    getGroupType().then(data => setListGroupType(data))
  }, [])

  const submitLogIn = (data) => {
    // console.log(data);
    const groupSubmittedData = {
      'groupName': data?.groupName,
      'groupDescription': data?.groupDescription,
      'coverImage': data?.coverImage || DEFAULT_COVER,
      'userStatusId': listStatus[0]?.groupStatusId,
      'groupTypeId': data?.groupType,
      'createdById': currentUser?.userId
    }
    toast.promise(
      createGroup(groupSubmittedData),
      { pending: 'Create group is in progress...' }
    ).then(
      (data) => {
        toast.success('Group created successfully')
        navigate(`/groups/${data?.groupId}`)
      }
    )
  }


  const confirmFile = useConfirm()
  const handleUploadFile = (e) => {
    const fileData = new FormData()
    const file = e.target.files[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    fileData.append('file', file)
    const url = URL.createObjectURL(file)
    confirmFile({
      title: (<div>Confirm using this file?<img src={url} /></div>),
      description: ('Are you sure you want to add this file? This file will be add into cloud if you click Confirm and cannot undo? '),
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      uploadImage({ userId: null, data: fileData }).then(data => {
        setValue('coverImage', data?.url)
        setCoverImage(data?.url)
        clearErrors('coverImage')
      })
    }).catch(() => { })
    e.target.value = ''
  }
  return (
    <>
      <div className="h-full w-full flex justify-center border-r-2 shadow-xl">
        <div className=" my-8 p-5 h-fit max-h-[90%] w-[80%] bg-white rounded-md shadow-md flex flex-col overflow-y-auto scrollbar-none-track">
          <div className="flex flex-col items-start gap-4">
            <span className='font-bold text-xl'>Create New Group</span>
            <div className="flex justify-start items-center mb-2 text-gray-500 gap-3" href='#'>
              <UserAvatar isOther={false} />
              <div className='flex flex-col '>
                <span className='font-semibold text-gray-900 capitalize'>{currentUser?.firstName + ' ' + currentUser?.lastName}</span>
                <span>Group Admin</span>
              </div>
            </div>
          </div>

          <form className="grid grid-cols-12 gap-4" onSubmit={handleSubmit(submitLogIn)}>
            <div className="col-span-12 lg:col-span-4 grid grid-cols-12 gap-4">
              <div className="col-span-12 h-fit">
                <TextField
                  label="Group name"
                  fullWidth
                  {...register('groupName', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: WHITESPACE_RULE,
                      message: WHITESPACE_MESSAGE
                    }
                  })}
                  error={!!errors['groupName']}
                  placeholder="Group name"
                />
                <FieldErrorAlert errors={errors} fieldName={'groupName'} />
              </div>

              <div className="col-span-12">
                <TextField
                  label="Group description"
                  multiline
                  fullWidth
                  {...register('groupDescription', {
                    required: FIELD_REQUIRED_MESSAGE,
                    pattern: {
                      value: WHITESPACE_RULE,
                      message: WHITESPACE_MESSAGE
                    }
                  })}
                  error={!!errors['groupDescription']}
                  placeholder="Group description"
                />
                <FieldErrorAlert errors={errors} fieldName={'groupDescription'} />
              </div>


              {/* <FormControl fullWidth className="col-span-12" error={!!errors.groupStatus}>
                <InputLabel id="labelPrivacy">Chose privacy</InputLabel>
                <Controller
                  name="groupStatus"
                  control={control}
                  rules={{ required: FIELD_REQUIRED_MESSAGE }}
                  render={({ field }) => (
                    <Select
                      labelId="labelPrivacy"
                      label="Chose privacy"
                      {...field}
                      value={field.value || ''}
                    >
                      {listStatus?.map(status => (
                        <MenuItem value={status?.groupStatusId} key={status?.groupStatusId}>
                          {status?.groupStatusName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="groupStatus" />
              </FormControl> */}

              <FormControl fullWidth className="col-span-12" error={!!errors.groupType}>
                <InputLabel id="labelGroupType">Chose group type</InputLabel>
                <Controller
                  name="groupType"
                  control={control}
                  rules={{ required: FIELD_REQUIRED_MESSAGE }}
                  render={({ field }) => (
                    <Select
                      labelId="labelGroupType"
                      label="Chose group type"
                      {...field}
                      value={field.value || ''}
                    >
                      {listGroupType?.map(type => (
                        <MenuItem value={type?.groupTypeId} key={type?.groupTypeId}>
                          {type?.groupTypeName}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                <FieldErrorAlert errors={errors} fieldName="groupType" />
              </FormControl>
            </div>

            <div className="col-span-12 lg:col-span-8">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold">Cover</span>
                <input
                  id="coverImage"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleUploadFile}
                />
                <input
                  className="hidden"
                  {...register('coverImage', {
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                />
                <label htmlFor="coverImage" className="interceptor-loading text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700">
                  Upload file
                </label>
              </div>
              <div className="flex w-full justify-center items-center pt-2 aspect-[74/27] rounded-md bg-cover bg-no-repeat"
                style={
                  { backgroundImage: `url(${coverImage})`, backgroundPosition: 'center' }
                }>
              </div>
              <FieldErrorAlert errors={errors} fieldName="coverImage" />
            </div>

            <div className="col-span-12">
              <button
                id="button"
                type="submit"
                className="interceptor-loading w-full p-4 font-medium bg-[#0866FF] text-white rounded-md hover:bg-opacity-85"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default GroupCreate
