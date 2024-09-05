import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material'
import { IconX } from '@tabler/icons-react'
import { useEffect } from 'react';

function Interests({ user, listInterest, listStatus, register, setValue, watch, errors }) {
  useEffect(() => {
    // console.log(watch('interest'))
    // console.log(typeof watch('interest') == 'string' ? watch('interest').split() : watch('interest') || user?.userInterests?.map(e => e?.interestId) || '');
    if (Array.isArray(watch('interest')) && watch('interest')[0]?.length == 0) setValue('interest', [])
    else if (typeof watch('interest') === 'string') {
      // console.log(watch('interest'));
      // console.log(typeof watch('interest'));
      setValue('interest', watch('interest').split(','))
    }
  }, [watch('interest')])

  const handleUpdateInterest = (e) => {
    const { target: { value } } = e
    const newListInterests = typeof value == 'string' ? value.split(',') : value
    if (newListInterests.length > 3) return
    setValue('interest', newListInterests)
  }
  const handleDeleteInterest = (value) => {
    const newListInterests = typeof watch('interest') == 'string'
      ? watch('interest')?.split(',').filter(e => e !== value)
      : watch('interest')?.filter(e => e !== value)
    setValue('interest', newListInterests)
  }

  return (
    <div className='w-full grid grid-cols-1 xs:grid-cols-2 gap-3 border border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Interests</span>
        </div>
      </div>

      <FormControl fullWidth className="col-span-2">
        <InputLabel id="labelInterest">Interest</InputLabel>
        <Select
          labelId="labelInterest"
          multiple
          label="Interest"
          input={<OutlinedInput label="Chip" />}
          {...register('interest')}
          onChange={handleUpdateInterest}
          // value={Array.isArray(watch('interest')) ? watch('interest') : (user?.userInterests?.map(e => e?.interestId) || [])}
          value={typeof watch('interest') == 'string' ? watch('interest').split() : watch('interest') || user?.userInterests?.map(e => e?.interestId) || ''}
          renderValue={(selected) => (
            <div className="flex flex-wrap gap-1">
              {selected.map((value) => (
                <div key={value}>
                  <Chip label={listInterest?.find(e => e.interestId == value)?.interestName}
                    onDelete={() => handleDeleteInterest(value)}
                    deleteIcon={<IconX
                      className='!text-white bg-red-500 rounded-full'
                      onMouseDown={(event) => event.stopPropagation()} />}
                  />
                </div>
              ))}
            </div>
          )}
        >
          {listInterest?.map(interest => (
            <MenuItem value={interest?.interestId} key={interest?.interestId}>{interest?.interestName}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="col-span-2 sm:col-span-1">
        <InputLabel id="labelStatusInterest">Status</InputLabel>
        <Select
          labelId="labelStatusInterest"
          label="Gender"
          {...register('interestStatus', {})}
          onChange={e => { setValue('interestStatus', e.target.value) }}
          value={watch('interestStatus') ?? ''}
        >
          {listStatus?.map(status => (
            <MenuItem value={status?.userStatusId} key={status?.userStatusId}>{status?.statusName}</MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default Interests
