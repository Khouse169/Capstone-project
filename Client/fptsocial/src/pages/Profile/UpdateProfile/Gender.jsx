import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'
import { Controller } from 'react-hook-form'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE } from '~/utils/validators';

function Gender({ user, control, listGender, listStatus, register, setValue, watch, errors }) {


  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Gender</span>
        </div>
      </div>
      {/* <Controller
        name="gender"
        control={control}
        defaultValue={user?.userGender?.genderId}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Select gender"
            onChange={(value) => field.onChange(value)}
            value={field.value}
          >
            <optgroup label="Select gender">
              {listGender?.map(gender => (
                <option key={gender?.genderId} value={gender?.genderId}>{gender?.genderName}</option>
              ))}
            </optgroup>
          </NativeSelect>
        )}
      /> */}

      <FormControl fullWidth className="col-span-2 sm:col-span-1">
        <InputLabel id="labelGender" required error={!!errors['gender']}>Gender</InputLabel>
        <Select
          labelId="labelGender"
          error={!!errors['gender']}
          label="Gender"
          {...register('gender', {
            required: FIELD_REQUIRED_MESSAGE
          })}
          onChange={e => setValue('gender', e.target.value)}
          value={watch('gender') || user?.userGender?.genderId}
        >
          {listGender?.map(gender => (
            <MenuItem value={gender?.genderId} key={gender?.genderId}>{gender?.genderName}</MenuItem>
          ))}
        </Select>
        <FieldErrorAlert errors={errors} fieldName={'gender'} />
      </FormControl>

      <FormControl fullWidth className="col-span-2 sm:col-span-1">
        <InputLabel id="labelStatusContact">Status</InputLabel>
        <Select
          labelId="labelStatusContact"
          // error={!!errors['contactStatus']}
          label="Gender"
          {...register('genderStatus', {})}
          onChange={e => { setValue('genderStatus', e.target.value) }}
          value={watch('genderStatus') ?? ''}
        >
          {listStatus?.map(status => (
            <MenuItem value={status?.userStatusId} key={status?.userStatusId}>{status?.statusName}</MenuItem>
          ))}
        </Select>
        {/* <FieldErrorAlert errors={errors} fieldName={'contactStatus'} /> */}
      </FormControl>

      {/* <Controller
        name="genderStatus"
        control={control}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Gender status"
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
  )
}

export default Gender
