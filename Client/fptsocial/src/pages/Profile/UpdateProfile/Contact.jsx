import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { Controller } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { EMAIL_MESSAGE, EMAIL_RULE, PHONE_NUMBER_MESSAGE, PHONE_NUMBER_RULE } from '~/utils/validators'

function Contact({ register, user, errors, control, listStatus, setValue, getValues, watch }) {


  return <div className='grid grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
    <div className='col-span-2'>
      <div className='flex items-center '>
        <span className='text-xl font-bold'>Contact</span>
      </div>
    </div>

    <TextField
      label="Primary number"
      className="col-span-2 xs:col-span-1"
      defaultValue={user?.contactInfo?.primaryNumber}
      placeholder="Primary number"
      error={!!errors['primaryNumber']}
      helperText={errors['primaryNumber']?.message}
      {...register('primaryNumber', {
        pattern: {
          value: PHONE_NUMBER_RULE,
          message: PHONE_NUMBER_MESSAGE
        }
      })}
    />

    <TextField
      label="Second number"
      className="col-span-2 xs:col-span-1"
      defaultValue={user?.contactInfo?.secondNumber}
      placeholder="Second number"
      error={!!errors['secondNumber']}
      helperText={errors['secondNumber']?.message}
      {...register('secondNumber', {
        pattern: {
          value: PHONE_NUMBER_RULE,
          message: PHONE_NUMBER_MESSAGE
        }
      })}
    />

    <TextField
      label="Second email"
      className="col-span-2 xs:col-span-1"
      defaultValue={user?.contactInfo?.secondEmail}
      placeholder="Second email"
      error={!!errors['secondEmail']}
      helperText={errors['secondEmail']?.message}
      {...register('secondEmail', {
        pattern: {
          value: EMAIL_RULE,
          message: EMAIL_MESSAGE
        }
      })}
    />

    <FormControl fullWidth className="col-span-2 xs:col-span-1">
      <InputLabel id="labelStatusContact">Status</InputLabel>
      <Select
        labelId="labelStatusContact"
        label="Gender"
        {...register('contactStatus', {})}
        onChange={e => { setValue('contactStatus', e.target.value) }}
        value={watch('contactStatus') ?? ''}
      >
        {listStatus?.map(status => (
          <MenuItem value={status?.userStatusId} key={status?.userStatusId}>{status?.statusName}</MenuItem>
        ))}
      </Select>
    </FormControl>

    {/* <Controller
      name="contactStatus"
      control={control}
      render={({ field }) => (
        <NativeSelect
          {...field}
          label="Contact status"
          onChange={(value) => field.onChange(value)}
          value={field.value}
        >
          <option value="" disabled>Select status</option>
          <optgroup >
            {listStatus?.map(status => (
              <option key={status?.userStatusId} value={status?.userStatusId}>{status?.statusName}</option>
            ))}
          </optgroup>
        </NativeSelect>
      )}
    /> */}
  </div>
}

export default Contact
