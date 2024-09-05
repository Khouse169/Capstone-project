import { Chip } from '@mui/material';
import { IconAffiliate, IconBriefcase2, IconCake, IconGenderMale, IconHeartFilled, IconHomeFilled, IconLink, IconMail, IconManFilled, IconPhone, IconRollerSkating, IconUser, IconUserCircle } from '@tabler/icons-react'
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import InfoItem from './InforItem';

function About({ user }) {
  const { t } = useTranslation()
  const [option, setOption] = useState(1)

  return <div id=''
    className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3'>
    <div
      id='info'
      className='w-full md:w-[70%] bg-white rounded-md shadow-lg'>
      <div className='flex w-full min-h-[300px]'>
        <div className='basis-4/12 border-r-2 flex flex-col gap-1 p-4 text-gray-500'>
          <span className='text-xl font-bold'>{t('standard.profile.about')}</span>
          <span className={`hover:bg-blue-100 hover:text-blue-500 py-1 px-2 rounded-md cursor-pointer ${option == 1 && 'bg-blue-50 text-blue-500'}`} onClick={() => setOption(1)}>{t('standard.profile.general')}</span>
          <span className={`hover:bg-blue-100 hover:text-blue-500 py-1 px-2 rounded-md cursor-pointer ${option == 2 && 'bg-blue-50 text-blue-500'}`} onClick={() => setOption(2)}>{t('standard.profile.contact')}</span>
          <span className={`hover:bg-blue-100 hover:text-blue-500 py-1 px-2 rounded-md cursor-pointer ${option == 3 && 'bg-blue-50 text-blue-500'}`} onClick={() => setOption(3)}>{t('standard.profile.webAffiliation')}</span>
        </div>
        <div className='basis-8/12 p-4 flex flex-col gap-4'>
          {
            option == 1 &&
            <>
              <div className='flex flex-col gap-1'>
                <div className='flex gap-1'>
                  <IconUser stroke={2} color='#c8d3e1' />
                  <span className='font-bold capitalize'>{user?.firstName + ' ' + user?.lastName || 'No information'}</span>
                </div>
                <div className='first-letter:uppercase text-sm ml-7'>{user?.aboutMe}</div>
              </div>
              <InfoItem Icon={IconHomeFilled} label={t('standard.profile.live')} value={user?.homeTown} />
              <InfoItem Icon={IconManFilled} label={t('standard.profile.gender')} value={user?.userGender?.genderName} />
              <InfoItem Icon={IconHeartFilled} label={t('standard.profile.relationship')} value={user?.userRelationship?.relationshipName} />
              <InfoItem Icon={IconCake} label={t('standard.profile.birthday')} value={new Date(user?.birthDay).toLocaleDateString()} />
              <div className='flex gap-1'>
                <IconRollerSkating stroke={2} color='#c8d3e1' />
                {
                  user?.userInterests?.map(e => (
                    <Chip key={e?.userInterestId} label={e?.interesName} color="warning" size='small' />
                  ))
                }
              </div>
            </>
          }
          {
            option == 2 &&
            <>
              <InfoItem Icon={IconMail} label={t('standard.profile.contact')} value={user?.contactInfo?.secondEmail} />
              <InfoItem Icon={IconPhone} label={t('standard.profile.phone')} value={user?.contactInfo?.primaryNumber} />
              <InfoItem Icon={IconPhone} label={t('standard.profile.phone')} value={user?.contactInfo?.secondNumber} />
              <InfoItem Icon={IconBriefcase2} label={t('standard.profile.workPlace')} value={user?.workPlaces[0]?.workPlaceName} />
            </>
          }
          {
            option == 3 &&
            <>
              <div className='flex gap-2'>
                <IconAffiliate stroke={2} color='#c8d3e1' />{t('standard.profile.webAffiliationMes')}
              </div>
              {
                user?.webAffiliations?.map(e =>
                  <div key={e?.webAffiliationId} className='flex gap-1'>
                    <IconLink /><a href={e?.webAffiliationUrl || ''} className='font-semibold text-xs'>{e?.webAffiliationUrl || 'No information'}</a></div>
                )
              }
            </>
          }
        </div>
      </div>
    </div>
  </div >
}

export default About;
