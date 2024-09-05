import styled from '@emotion/styled'
import { Button, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { uploadImage } from '~/apis'
import { deleteGroup, getGroupSettingByGroupId, getGroupStatusForCreate, getGroupType, updateGroupInformation, updateGroupSetting } from '~/apis/groupApis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { PRIVATE, PUBLIC } from '~/utils/constants'
import { FIELD_REQUIRED_MESSAGE, singleFileValidator, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function GroupSetting({ group }) {
  const [listGroupSetting, setListGroupSetting] = useState([])
  const [listGroupType, setListGroupType] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const [settingStatus, setSettingStatus] = useState([])
  const publicStatus = settingStatus.find(status => status.groupStatusName?.toLowerCase() === PUBLIC)?.groupStatusId
  const privateStatus = settingStatus.find(status => status.groupStatusName?.toLowerCase() === PRIVATE)?.groupStatusId
  const isReload = useSelector(selectIsReload)
  const dispatch = useDispatch()
  const [coverImage, setCoverImage] = useState(group?.coverImage)

  useEffect(() => {
    getGroupSettingByGroupId(group?.groupId).then(data => setListGroupSetting(data))
    getGroupStatusForCreate().then(data => setSettingStatus(data))
    getGroupType().then(data => setListGroupType(data))
  }, [group, isReload])

  const Android12Switch = styled(Switch)(({ theme }) => ({
    padding: 8,
    '& .MuiSwitch-track': {
      borderRadius: 22 / 2,
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        width: 16,
        height: 16,
      },
      '&::before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
        left: 12,
      },
      '&::after': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
          theme.palette.getContrastText(theme.palette.primary.main),
        )}" d="M19,13H5V11H19V13Z" /></svg>')`,
        right: 12,
      },
    },
    '& .MuiSwitch-thumb': {
      boxShadow: 'none',
      width: 16,
      height: 16,
      margin: 2,
    },
  }));
  const { register, setValue, clearErrors, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
    }
  })
  const handleUpdateSetting = (groupSettingId, currentStatusId) => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': group?.groupId,
      updateSettingDTOs: [
        {
          'settingId': groupSettingId,
          'groupStatusId': currentStatusId == publicStatus ? privateStatus : publicStatus,
        }
      ]

    }
    updateGroupSetting(submitData).then(() => {
      updateGroupInformation({
        'userId': currentUser?.userId,
        'groupId': group?.groupId,
        'groupName': group?.groupName,
        'description': group?.groupDescription,
        'groupTypeId': group?.groupTypeId,
        'coverImage': coverImage,
        'groupStatusId': currentStatusId == publicStatus ? privateStatus : publicStatus
      })
    }).then(() => dispatch(triggerReload()))
  }

  const updateGroup = (data) => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': group?.groupId,
      'groupName': data?.groupName,
      'description': data?.groupDescription,
      'groupTypeId': data?.groupType,
      'coverImage': data?.coverImage,
      'groupStatusId': listGroupSetting?.find(e => e?.groupSettingName?.toLowerCase().includes('group status'))?.groupStatusId
    }
    // console.log('🚀 ~ updateGroupInformation ~ data:', submitData)
    updateGroupInformation(submitData).then(() => {
      toast.success('Group updated successfully!')
      dispatch(triggerReload())
    })
  }


  const backgroundStyle = !!coverImage && coverImage.length !== 0
    ? { backgroundImage: `url(${coverImage})`, backgroundPosition: 'center' }
    : {
      background: 'linear-gradient(to bottom, #E9EBEE 80%, #8b9dc3 100%)'
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

  const navigate = useNavigate()
  const handleDeleteGroup = () => {
    confirmFile({
      title: (
        <div className='flex flex-col gap-2'>
          <div className='font-bold text-[#d22e2e]'>Delete group?</div>
          <div className='text-sm'>
            Deleting a group is a permanent action and cannot be undone.<br />
            All content, settings, and members associated with this group will be permanently removed. This includes any posts, files, calendar events, and other data created within the group.<br />
            Once the group is deleted, there is no way to recover it or its contents<br />
            <span className='text-[#d22e2e] font-bold'>Do you still want to permanently delete the group?</span>
          </div>
        </div>
      ),
      description: (''),
      confirmationButtonProps: { color: 'error', variant: 'contained' },
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      const submitData = {
        'userId': currentUser?.userId,
        'groupId': group?.groupId,
      }
      deleteGroup(submitData).then(() => navigate('/groups'))
    }).catch(() => { })
  }

  return (
    <div className='bg-fbWhite w-full overflow-y-auto scrollbar-none-track'>
      <div className='flex flex-col items-center mt-4 mb-4'>
        <div className='flex flex-col gap-4 w-[90%] md:w-[70%]'>
          <form className="grid grid-cols-12 gap-4  bg-white p-2 rounded-lg" onSubmit={handleSubmit(updateGroup)}>
            <div className="col-span-12 lg:col-span-4 grid grid-cols-12 gap-4">
              <div className="col-span-12 h-fit">
                <TextField
                  label="Group name"
                  defaultValue={group?.groupName}
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
                  defaultValue={group?.groupDescription}
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

              <FormControl fullWidth className="col-span-12" error={!!errors.groupType}>
                <InputLabel id="labelGroupType">Chose group type</InputLabel>
                <Controller
                  name="groupType"
                  control={control}
                  defaultValue={group?.groupTypeId}
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
                  defaultValue={group?.coverImage}
                  {...register('coverImage', {
                    required: FIELD_REQUIRED_MESSAGE
                  })}
                />
                <label htmlFor="coverImage" className="interceptor-loading text-sm text-white px-2 py-1 rounded-md cursor-pointer bg-[#1976d2] hover:bg-blue-700">
                  Upload file
                </label>
              </div>
              <div className="flex w-full justify-center items-center pt-2 aspect-[74/27] rounded-md bg-cover bg-no-repeat"
                style={backgroundStyle}
              >
              </div>
              <FieldErrorAlert errors={errors} fieldName="coverImage" />
            </div>

            <div className="col-span-12">
              <Button className='interceptor-loading' variant="contained" type='submit'>
                Save
              </Button>
            </div>
          </form>
          {
            listGroupSetting?.map(setting => (
              <div key={setting?.groupSettingId} className='flex h-fit justify-between items-center bg-white p-4 rounded-lg'>
                <div className='font-semibold'>{setting?.groupSettingName}</div>
                <FormGroup
                  sx={{
                    '& .MuiFormControlLabel-root': {
                      display: 'flex',
                      flexDirection: 'column'
                    }
                  }}>
                  <FormControlLabel
                    control={<Android12Switch sx={{ m: 1 }} />}
                    // value={userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId == publicId}
                    checked={listGroupSetting?.find(e => e.groupSettingId == setting?.groupSettingId)?.groupStatusId == publicStatus}
                    onChange={() => handleUpdateSetting(
                      setting?.groupSettingId,
                      setting?.groupStatusId
                    )}
                    label={
                      setting.groupStatusId == publicStatus ?
                        <span className='text-blue-500 font-bold'>
                          {setting?.groupSettingName?.includes('Group Status') ? 'Public' : 'Auto'}
                        </span>
                        : <span className='text-red-500 font-bold'>
                          {setting?.groupSettingName?.includes('Group Status') ? 'Private' : 'Manual'}
                        </span>
                    }
                  />
                </FormGroup>
              </div>
            ))
          }
          <div className='flex flex-col gap-2 bg-white p-2 rounded-lg'>
            <span className='text-red-600 font-bold'>Delete group</span>
            <Button className='interceptor-loading' color='error' variant="contained" onClick={handleDeleteGroup}>
              Delete group
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GroupSetting
