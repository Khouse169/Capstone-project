import { Button, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { createGender, createGroupType, createInterest, getGender, getInterest } from '~/apis'
import { getGroupType } from '~/apis/groupApis'
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function SystemSetting() {
  const [listGender, setListGender] = useState([])
  const [listInterest, setListInterest] = useState([])
  const [listGroupType, setListGroupType] = useState([])
  const [isAddingGender, setIsAddingGender] = useState(false)
  const [isAddingInterest, setIsAddingInterest] = useState(false)
  const [isAddingGroupType, setIsAddingGroupType] = useState(false)

  const { control: genderControl, handleSubmit: handleSubmitGender, reset: resetGender } = useForm()
  const { control: interestControl, handleSubmit: handleSubmitInterest, reset: resetInterest } = useForm()
  const { control: groupTypeControl, handleSubmit: handleSubmitGroupType, reset: resetGroupType } = useForm()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = () => {
    getGender().then(data => setListGender(data))
    getInterest().then(data => setListInterest(data))
    getGroupType().then(data => setListGroupType(data))
  }

  const onSubmitGender = async (data) => {
    await createGender({ 'genderName': data.gender })
    setIsAddingGender(false)
    resetGender()
    fetchData()
  }

  const onSubmitInterest = async (data) => {
    await createInterest({ 'interestName': data.interest })
    setIsAddingInterest(false)
    resetInterest()
    fetchData()
  }

  const onSubmitGroupType = async (data) => {
    await createGroupType({ 'groupTypeName': data.groupType })
    setIsAddingGroupType(false)
    resetGroupType()
    fetchData()
  }

  const renderAddButton = (label, isAdding, setIsAdding) => (
    <div>
      <Button
        color='warning'
        variant='contained'
        size='small'
        onClick={() => setIsAdding(true)}
      >
        {`Add ${label}`}
      </Button>
    </div>

  )

  const renderAddForm = (name, control, onSubmit, onCancel) => (
    <form onSubmit={onSubmit} className='flex gap-2 items-start'>
      <Controller
        name={name}
        control={control}
        defaultValue=""
        rules={{
          pattern: {
            value: WHITESPACE_RULE,
            message: WHITESPACE_MESSAGE
          },
          required: FIELD_REQUIRED_MESSAGE
        }}
        render={({ field, fieldState: { error } }) => (
          <TextField
            {...field}
            size='small'
            placeholder={`Enter new ${name}`}
            error={!!error}
            helperText={error?.message}
          />
        )}
      />
      <Button variant='contained' size='small' type="submit" color='warning'>
        Save
      </Button>
      <Button variant='outlined' size='small' color='inherit' onClick={onCancel}>
        Cancel
      </Button>
    </form>
  )

  return (
    <div className='bg-white flex flex-col justify-center items-center gap-2 h-full'>
      <h1 className='text-2xl font-bold uppercase'>System settings</h1>
      <div className='w-[95%] h-[80%] border rounded-md shadow-xl bg-gray-50 p-4'>
        <div className='grid grid-cols-12 gap-2 overflow-y-auto h-full scrollbar-none-track'>
          <div className='col-span-12 md:col-span-6 border rounded-md p-2 flex flex-col gap-2 shadow-lg '>
            <div className='mb-2'>
              <div className='text-xl font-semibold uppercase'>User</div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-start'>
                {!isAddingGender
                  ? renderAddButton('gender', isAddingGender, setIsAddingGender)
                  : renderAddForm(
                    'gender',
                    genderControl,
                    handleSubmitGender(onSubmitGender),
                    () => {
                      setIsAddingGender(false)
                      resetGender()
                    }
                  )
                }
              </div>
              <div className='w-full bg-fbWhite rounded-lg p-2'>
                {listGender?.map(gender => (
                  <div key={gender?.genderId} className='border-b p-2'>{gender?.genderName}</div>
                ))}
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-start'>
                {!isAddingInterest
                  ? renderAddButton('interest', isAddingInterest, setIsAddingInterest)
                  : renderAddForm(
                    'interest',
                    interestControl,
                    handleSubmitInterest(onSubmitInterest),
                    () => {
                      setIsAddingInterest(false)
                      resetInterest()
                    }
                  )
                }
              </div>
              <div className='w-full bg-fbWhite rounded-lg p-2'>
                {listInterest?.map(interest => (
                  <div key={interest?.interestId} className='border-b p-2'>{interest?.interestName}</div>
                ))}
              </div>
            </div>
          </div>
          <div className='col-span-12 md:col-span-6 border rounded-md p-2 flex flex-col gap-2 shadow-lg'>
            <div className='mb-2'>
              <div className='text-xl font-semibold uppercase'>Group</div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className='flex items-start'>
                {!isAddingGroupType
                  ? renderAddButton('group type', isAddingGroupType, setIsAddingGroupType)
                  : renderAddForm(
                    'groupType',
                    groupTypeControl,
                    handleSubmitGroupType(onSubmitGroupType),
                    () => {
                      setIsAddingGroupType(false)
                      resetGroupType()
                    }
                  )
                }
              </div>
              <div className='w-full bg-fbWhite rounded-lg p-2'>
                {listGroupType?.map(type => (
                  <div key={type?.groupTypeId} className='border-b p-2'>{type?.groupTypeName}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SystemSetting