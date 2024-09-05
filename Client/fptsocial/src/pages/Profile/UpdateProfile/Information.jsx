import { TextField } from '@mui/material'
import moment from 'moment';
import { FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function Information({ register, user, errors }) {
  const getYesterday = () => {
    return moment().subtract(1, 'days').format('YYYY-MM-DD');
  };

  const formatBirthday = (birthday) => {
    return birthday ? moment(birthday).format('YYYY-MM-DD') : '';
  };

  return (
    <div className='grid grid-cols-1 xs:grid-cols-2 gap-3 border-2 border-blue-500 p-2 rounded-md'>
      <div className='col-span-1 xs:col-span-2'>
        <div className='flex items-center '>
          <span className='text-xl font-bold'>Information</span>
        </div>
      </div>

      <TextField
        label="First name"
        defaultValue={user?.firstName}
        placeholder="First name"
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
      <TextField
        label="Last name"
        defaultValue={user?.lastName}
        placeholder="Last name"
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

      <TextField
        label="Hometown"
        defaultValue={user?.homeTown}
        placeholder="Hometown"
        error={!!errors['homeTown']}
        helperText={errors['homeTown']?.message}
        {...register('homeTown', {
          pattern: {
            value: WHITESPACE_RULE,
            message: WHITESPACE_MESSAGE
          }
        })}
      />

      <TextField
        label="Birthday"
        type="date"
        inputProps={{
          max: getYesterday(),
        }}
        defaultValue={formatBirthday(user?.birthDay)}
        placeholder="Birthday"
        {...register('birthDay', {})}
      />
      <TextField
        className='xs:col-span-2'
        label="About me"
        defaultValue={user?.aboutMe}
        placeholder="About me"
        error={!!errors['aboutMe']}
        helperText={errors['aboutMe']?.message}
        {...register('aboutMe', {
          pattern: {
            value: WHITESPACE_RULE,
            message: WHITESPACE_MESSAGE
          }
        })}
      />
    </div>
  )

}

export default Information
