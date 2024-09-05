import { Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material'
import { useEffect, useState } from 'react'
import { getInterest, getRelationships } from '~/apis'
import FieldErrorAlert from '~/components/Form/FieldErrorAlert'
import { WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'
import { red } from '@mui/material/colors'
import { IconX } from '@tabler/icons-react'


function Step2({ register, errors, setValue, getValues }) {
  const [listInterest, setListInterest] = useState([])
  const [listRelationship, setListRelationship] = useState([])
  const [selectedRelationship, setSelectedRelationship] = useState([])
  const [selectedInterests, setSelectedInterests] = useState([])

  useEffect(() => {
    getInterest()
      .then(data => setListInterest(data))
    getRelationships().then(data => setListRelationship(data))
  }, [])

  const handleUpdateInterest = (e) => {
    const { target: { value } } = e
    const newListInterests = typeof value == 'string' ? value.split(',') : value
    setSelectedInterests(newListInterests)
    setValue('interest', newListInterests)
  }
  const handleDeleteInterest = (value) => {
    const newListInterests = getValues('interest')?.filter(e => e !== value)
    setSelectedInterests(newListInterests)
    setValue('interest', newListInterests)
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Other Information </span>
      </div>

      <div className='px-4 pb-10 text-md font-semibold' >
        <div className='grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-y-2 mt-4'>

          <FormControl fullWidth className="col-span-2">
            <InputLabel id="labelInterest" error={!!errors['interest']}>Interest</InputLabel>
            <Select
              labelId="labelInterest"
              multiple
              error={!!errors['interest']}
              label="Interest"
              input={<OutlinedInput label="Chip" />}
              {...register('interest')}
              onChange={handleUpdateInterest}
              value={getValues('interest') || []}
              renderValue={(selected) => (
                <div className="flex flex-wrap gap-1">
                  {selected.map((value) => (
                    <div key={value}>
                      <Chip label={listInterest?.find(e => e.interestId == value)?.interestName}
                        onDelete={() => handleDeleteInterest(value)}
                        deleteIcon={<IconX
                          sx={{
                            color: 'white !important',
                            backgroundColor: red[500],
                            borderRadius: '50%',
                            '&:hover': {
                              backgroundColor: red[700]
                            }
                          }}
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
            <FieldErrorAlert errors={errors} fieldName={'interest'} />
          </FormControl>



          <FormControl fullWidth className="col-span-2 sm:col-span-1">
            <InputLabel id="labelRelationship" error={!!errors['relationship']}>Relationship</InputLabel>
            <Select
              labelId="labelRelationship"
              error={!!errors['relationship']}
              label="Relationship"
              {...register('relationship')}
              onChange={e => { setValue('relationship', e.target.value); setSelectedRelationship(e.target.value) }}
              value={getValues('relationship') ?? ''}
            >
              {listRelationship?.map(relationship => (
                <MenuItem value={relationship?.relationShipId} key={relationship?.relationShipId}>{relationship?.relationshipName}</MenuItem>
              ))}
            </Select>
            <FieldErrorAlert errors={errors} fieldName={'relationship'} />
          </FormControl>

          <TextField
            className='col-span-2 sm:col-span-1'
            label="Workplace"
            placeholder="Workplace"
            error={!!errors['workPlace']}
            {...register('workPlace', {
              pattern: {
                value: WHITESPACE_RULE,
                message: WHITESPACE_MESSAGE
              }
            })}
          />
          <FieldErrorAlert errors={errors} fieldName={'workPlace'} />
        </div>
      </div >
    </div >
  )
}

export default Step2;
