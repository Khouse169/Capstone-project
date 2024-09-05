import { Button, TextField } from '@mui/material';
import { IconCircleCheck } from '@tabler/icons-react';
import FieldErrorAlert from '~/components/Form/FieldErrorAlert';
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators';

function AdminUpdate({ profileFeId, register, errors, submitForm }) {
  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Update Admin Profile</span>
      </div>

      <div className='px-4 pb-10 text-md font-semibold mt-3' >
        <div className='grid grid-cols-2 gap-x-2 gap-y-3 sm:gap-y-5 mt-4'>
          <div className="col-span-2 sm:col-span-1">
            <TextField
              label="First name"
              fullWidth
              focused
              size='small'
              variant='standard'
              error={!!errors['firstName']}
              helperText={errors['firstName']?.message}
              {...register('firstName', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: WHITESPACE_RULE,
                  message: WHITESPACE_MESSAGE
                }
              })}
            />
          </div>

          <div className="col-span-2 sm:col-span-1">
            <TextField
              label="Last name"
              fullWidth
              focused
              size='small'
              variant='standard'
              error={!!errors['lastName']}
              helperText={errors['lastName']?.message}
              {...register('lastName', {
                required: FIELD_REQUIRED_MESSAGE,
                pattern: {
                  value: WHITESPACE_RULE,
                  message: WHITESPACE_MESSAGE
                }
              })}
            />
          </div>

          <TextField
            className="col-span-2 sm:col-span-1"
            disabled
            size='small'
            variant="standard"
            label="Email"
            placeholder="Email"
            {...register('email', {})}
          />
          <TextField
            className="col-span-2 sm:col-span-1"
            disabled
            size='small'
            value={profileFeId?.username
            }
            variant="standard"
            label="Username"
          />

          <div className="col-span-2 sm:col-span-1">
            <TextField
              disabled
              size='small'
              focused
              label="Role"
              value={profileFeId?.role}
              variant="standard"
              fullWidth
            />
          </div>
          <div className="col-span-2 ">
            <Button className='interceptor-loading' variant='contained'
              onClick={submitForm}
            >Save
            </Button>
          </div>
        </div>
      </div >
    </div >
  )
}

export default AdminUpdate;
