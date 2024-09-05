import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { Controller } from 'react-hook-form'

function Relationship({ user, listRelationship, control, listStatus, register, setValue, watch, errors }) {

  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Relationships</span>
        </div>
      </div>

      {/* <Controller
        name="relationship"
        control={control}
        defaultValue={user?.userRelationship?.relationshipId ?? ''}
        render={({ field }) => (
          <NativeSelect
            {...field}
            onChange={(value) => field.onChange(value)}
            value={field.value}
            label="Your relationship"
          >
            <option value='' disabled>Select status</option>
            <optgroup >
              {listRelationship?.map(relationship => (
                <option key={c} value={relationship?.relationShipId}>{relationship?.relationshipName}</option>
              ))}
            </optgroup>
          </NativeSelect>
        )}
      /> */}

      <FormControl fullWidth className="col-span-2 sm:col-span-1">
        <InputLabel id="labelRelationship" >Relationship</InputLabel>
        <Select
          labelId="labelRelationship"
          label="Relationship"
          {...register('relationship')}
          onChange={e => setValue('relationship', e.target.value)}
          value={watch('relationship') || user?.userRelationship?.relationshipId}
        >
          {listRelationship?.map(relationship => (
            <MenuItem value={relationship?.relationShipId} key={relationship?.relationShipId}>{relationship?.relationshipName}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth className="col-span-2 sm:col-span-1">
        <InputLabel id="labelStatusContact" >Status</InputLabel>
        <Select
          labelId="labelStatusContact"
          label="Gender"
          {...register('relationshipStatus', {})}
          onChange={e => { setValue('relationshipStatus', e.target.value) }}
          value={watch('relationshipStatus') ?? ''}
        >
          {listStatus?.map(status => (
            <MenuItem value={status?.userStatusId} key={status?.userStatusId}>{status?.statusName}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <Controller
        name="relationshipStatus"
        control={control}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Relationship status"
            onChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <option value='' disabled>Select status</option>
            <optgroup>
              {listStatus?.map(status => (
                <option key={status?.userStatusId} value={status?.userStatusId}>{status?.statusName}</option>
              ))}
            </optgroup>
          </NativeSelect>
        )}
      /> */}
    </div>
  )
}

export default Relationship
