import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { Controller } from 'react-hook-form'
import { getGender } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function Step1({ register, errors, control, setValue, getValues }) {
  const yesterday = new Date(new Date().getTime() - (24 * 60 * 60 * 1000)).toISOString().split('T')[0]
  const [listGender, setListGender] = useState([])
  const [selectedGender, setSelectedGender] = useState('')

  useEffect(() => {
    getGender().then(data => setListGender(data))
  }, [])

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Main Information<span className='text-red-500'>(*)</span></span>
      </div>

      <div className='px-4 pb-10 text-md font-semibold' >
        <div className='grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-y-5 mt-4'>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              label="First name"
              fullWidth
              required
              error={!!errors['firstName']}
              placeholder="First name"
              {...register('firstName', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: WHITESPACE_RULE,
                  message: WHITESPACE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'firstName'} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <TextField
              label="Last name"
              required
              fullWidth
              error={!!errors['lastName']}
              placeholder="Last name"
              {...register('lastName', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: WHITESPACE_RULE,
                  message: WHITESPACE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'lastName'} />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <TextField
              className="col-span-2 sm:col-span-1"
              label="Birthday"
              type="date"
              required
              fullWidth
              InputLabelProps={{ shrink: true }}
              max={yesterday}
              error={!!errors['birthDay']}
              placeholder="Birthday"
              {...register('birthDay', { required: FIELD_REQUIRED_MESSAGE })}
            />
            <FieldErrorAlert errors={errors} fieldName={'birthDay'} />
          </div>

          <FormControl fullWidth className="col-span-2 sm:col-span-1">
            <InputLabel id="labelGender" required error={!!errors['genderId']}>Gender</InputLabel>
            <Select
              labelId="labelGender"
              error={!!errors['genderId']}
              label="Gender"
              {...register('genderId', {
                required: FIELD_REQUIRED_MESSAGE
              })}
              onChange={e => { setSelectedGender(e.target.value); setValue('genderId', e.target.value) }}
              value={getValues('genderId') ?? ''}
            >
              {listGender?.map(gender => (
                <MenuItem value={gender?.genderId} key={gender?.genderId}>{gender?.genderName}</MenuItem>
              ))}
            </Select>
            <FieldErrorAlert errors={errors} fieldName={'genderId'} />
          </FormControl>

          <TextField
            className="col-span-2 sm:col-span-1"
            disabled
            variant="filled"
            label="Email"
            placeholder="Email"
            {...register('email', {})}
          />

          <div className="col-span-2 sm:col-span-1">
            <TextField
              label="Hometown"
              error={!!errors['homeTown']}
              fullWidth
              placeholder="Hometown"
              {...register('homeTown', {
                pattern: {
                  value: WHITESPACE_RULE,
                  message: WHITESPACE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'homeTown'} />
          </div>

          <div className="col-span-2">
            <TextField
              label="About me"
              fullWidth
              multiline
              error={!!errors['aboutMe']}
              placeholder="About me"
              {...register('aboutMe', {
                pattern: {
                  value: WHITESPACE_RULE,
                  message: WHITESPACE_MESSAGE
                }
              })}
            />
            <FieldErrorAlert errors={errors} fieldName={'aboutMe'} />
          </div>
        </div>
      </div >
    </div >
  )
}

export default Step1
