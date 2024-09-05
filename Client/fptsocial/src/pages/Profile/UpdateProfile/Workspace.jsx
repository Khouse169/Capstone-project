import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import { WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function Workspace({ register, user, errors, control, listStatus, setValue, watch }) {


  return (
    <div className='grid grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Workplace</span>
        </div>
      </div>
      <TextField
        label="Workplace"
        className="col-span-2 xs:col-span-1"
        defaultValue={user?.workPlaces[0]?.workPlaceName}
        placeholder="Workplace"
        error={!!errors['workPlace']}
        helperText={errors['workPlace']?.message}
        {...register('workPlace', {
          pattern: {
            value: WHITESPACE_RULE,
            message: WHITESPACE_MESSAGE
          }
        })}
      />

      <FormControl fullWidth className="col-span-2 xs:col-span-1">
        <InputLabel id="labelStatusWorkplaces">Status</InputLabel>
        <Select
          labelId="labelStatusWorkplaces"
          label="Status"
          {...register('workplaceStatus', {})}
          onChange={e => { setValue('workplaceStatus', e.target.value) }}
          value={watch('workplaceStatus') ?? ''}
        >
          {listStatus?.map(status => (
            <MenuItem value={status?.userStatusId} key={status?.userStatusId}>{status?.statusName}</MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* <Controller
        name="workplaceStatus"
        control={control}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Workplace status"
            onChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <option value='' disabled>Select status</option>
            <optgroup >
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

export default Workspace
