import { useEffect, useState } from 'react'
import { Form, useNavigate } from 'react-router-dom'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { getListSettings, getStatus, getUserSettings, updateSettings } from '~/apis'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { FormControlLabel, FormGroup, Switch } from '@mui/material'
import styled from '@emotion/styled'

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  '& .MuiSwitch-track': {
    borderRadius: 22 / 2,
    '&::before, &::after': {
      content: '""',
      position: 'absolute',
      top: '50%',
      transform: 'translateY(-50%)',
      width: 16,
      height: 16,
    },
    '&::before': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    '&::after': {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main),
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  '& .MuiSwitch-thumb': {
    boxShadow: 'none',
    width: 16,
    height: 16,
    margin: 2,
  },
}));

function Setting() {
  const [listSetting, setListSetting] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [userSetting, setUserSetting] = useState([])
  const privateId = listStatus?.find(e => e.statusName.toLowerCase() == 'private')?.userStatusId
  const publicId = listStatus?.find(e => e.statusName.toLowerCase() == 'public')?.userStatusId
  const navigate = useNavigate()

  const { handleSubmit } = useForm({})
  useEffect(() => {
    getListSettings().then(data => setListSetting(data))
    getStatus().then(data => setListStatus(data))
    getUserSettings().then(data => setUserSetting(data?.usersettings))
  }, [])

  const handleUpdateStatus = (settingId, currentStatusId) => {
    setUserSetting(prev => prev.map(e => {
      if (e?.settingId == settingId)
        return { ...e, userStatusId: currentStatusId == publicId ? privateId : publicId }
      return e
    }))
  }

  const submitSetting = (data) => {
    const submitData = {
      'userId': userSetting[0]?.userId,
      'userSettings': userSetting?.map(e => {
        const { userId, ...rest } = e
        return rest
      })
    }
    toast.promise(
      updateSettings(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      navigate('/')
      toast.success('Setting updated successfully')
    })
  }

  return (
    <div className='bg-fbWhite'>
      <NavTopBar />
      <div className='h-[calc(100vh_-_55px)] flex justify-center'>
        <div className='bg-white w-[90%] md:w-[500px] h-fit mt-8 rounded-xl shadow-md'>
          <div className='flex flex-col p-4'>
            <div className='flex justify-between items-center pb-2 border-b-2'>
              <span></span>
              <span className='text-xl font-bold'>User settings</span>
              <span></span>
            </div>
            <form className='flex flex-col gap-5' onSubmit={handleSubmit(submitSetting)}>
              {
                listSetting?.map(setting => (
                  <div key={setting?.settingId}>
                    <div className='font-bold text-lg'>{setting?.settingName}</div>
                    <div className='flex gap-3 font-semibold'>
                      <FormGroup>
                        <FormControlLabel
                          control={<Android12Switch sx={{ m: 1 }} />}
                          value={userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId == publicId}
                          checked={userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId == publicId}
                          onChange={() => handleUpdateStatus(
                            setting?.settingId,
                            userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId
                          )}
                          label={
                            userSetting?.find(e => e.settingId == setting?.settingId)?.userStatusId == publicId ?
                              <span><span className='text-blue-500 font-bold'>Public</span>. Everyone can see you</span> :
                              <span><span className='text-red-500 font-bold'>Private</span>. No one can see you </span>
                          }
                        />
                      </FormGroup>
                    </div>
                  </div>
                ))
              }
              <div className="w-full">
                <button id="button" type="submit"
                  className="interceptor-loading w-full p-4 font-bold bg-orangeFpt text-white rounded-md hover:bg-orange-600">Update Setting</button>
              </div>
            </form>

          </div>
        </div>
      </div>
    </div>

  )
}

export default Setting
