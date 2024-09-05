import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { IconPlus } from '@tabler/icons-react'
import { useEffect } from 'react'
import { Controller } from 'react-hook-form'
import { URL_RULE, URl_MESSAGE } from '~/utils/validators'

function WebAffiliations({ register, user, errors, control, listStatus, inputs, handleAddInput, setValue, watch }) {


  return (
    <div className='grid grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Web Affiliations</span>
        </div>
      </div>
      <div className='flex flex-col gap-5 col-span-2 xs:col-span-1'>
        {inputs.map((input, index) => (
          <TextField
            key={index}
            className="col-span-2 xs:col-span-1"
            label={index === 0 ? 'Websites and social links' : null}
            defaultValue={input?.webAffiliationUrl}
            placeholder="Enter URL"
            error={!!errors[`webAffiliations_${index}`]}
            helperText={errors[`webAffiliations_${index}`]?.message}
            {...register(`webAffiliations_${index}`, {
              pattern: {
                value: URL_RULE,
                message: URl_MESSAGE
              }
            })}
          />
        ))}
        {inputs.length < 3 && (
          <div className='flex items-center text-white text-sm font-semibold'>
            <span className='flex justify-center items-center gap-2 bg-blue-500 rounded-md p-2 cursor-pointer' onClick={handleAddInput}>
              <IconPlus className='' />Add an URL
            </span>
          </div>
        )}
      </div>

      <FormControl fullWidth className="col-span-2 xs:col-span-1">
        <InputLabel id="labelWebContact">Status</InputLabel>
        <Select
          labelId="labelWebContact"
          // error={!!errors['contactStatus']}
          label="Status"
          {...register('webAffiliationsStatus', {})}
          onChange={e => { setValue('webAffiliationsStatus', e.target.value) }}
          value={watch('webAffiliationsStatus') ?? ''}
        >
          {listStatus?.map(status => (
            <MenuItem value={status?.userStatusId} key={status?.userStatusId}>{status?.statusName}</MenuItem>
          ))}
        </Select>
        {/* <FieldErrorAlert errors={errors} fieldName={'contactStatus'} /> */}
      </FormControl>

      {/* <Controller
        name="webAffiliationsStatus"
        control={control}
        render={({ field }) => (
          <NativeSelect
            {...field}
            label="Web affiliations status"
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

export default WebAffiliations
