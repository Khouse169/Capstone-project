import { useEffect, useRef, useState } from 'react'
import Step0 from './Step0'
import Step1 from './Step1'
import { useForm } from 'react-hook-form'
import Step2 from './Step2'
import Step3 from './Step3'
import Progress from './Progress'
import { createAdminProfile, createByLogin, createUserChat, getStatus } from '~/apis'
import { toast } from 'react-toastify'
import { useLocation, useNavigate } from 'react-router-dom'
import { DEFAULT_AVATAR, DEFAULT_COVER, JWT_PROFILE } from '~/utils/constants'
import AdminUpdate from './AdminUpdate'
import { createPost } from '~/apis/postApis'

function FirstTimeLogin() {
  const [step, setStep] = useState(0)
  const [listStatus, setListStatus] = useState([])
  const location = useLocation()
  const isAdmin = location.pathname === '/updateadmin'
  const isOther = location.pathname === '/firstlogin'
  const formRef = useRef(null)
  const navigate = useNavigate()
  const profileFeId = JWT_PROFILE
  const initialGeneralForm = {
    'email': profileFeId?.email,
    'coverImage': DEFAULT_COVER,
    'avataphoto': DEFAULT_AVATAR,
  }

  const { register, control, getValues, setValue, watch, handleSubmit, trigger, formState: { errors, isValid } } = useForm({ mode: 'all', defaultValues: initialGeneralForm })

  const totalStep = 3
  const handlePrev = () => {
    if (step >= 1) setStep(step - 1)
  }
  const handleNext = async () => {
    if (step < 3) setStep(step + 1)
  }

  useEffect(() => {
    if (!isValid) {
      trigger()
    }
  }, [isValid, trigger])

  useEffect(() => {
    getStatus().then(data => setListStatus(data))
  }, [])

  const processWidth = () => {
    if (step >= 1) return (step - 1) / (totalStep - 1) * 100
  }

  const renderSteps = () => {
    switch (step) {
      case 1: return <Step1 register={register} errors={errors} control={control} getValues={getValues} setValue={setValue} />
      case 2: return <Step2 register={register} errors={errors} control={control} getValues={getValues} setValue={setValue} />
      case 3: return <Step3 register={register} errors={errors} watch={watch} getValues={getValues} setValue={setValue} />
    }
  }

  const submitData = (data) => {
    // console.log(data)
    const submitData1 = {
      'useId': null,
      'firstName': data?.firstName,
      'lastName': data?.lastName,
      'email': data?.email,
      'feId': profileFeId?.email,
      'roleName': null,
      'birthDay': data?.birthDay,
      'gender': {
        'genderId': data?.genderId,
      },
      'contactInfor': {
        'secondEmail': null,
        'primaryNumber': '',
        'secondNumber': null,
        'userStatusId': null
      },
      'relationship': {
        'relationshipId': data?.relationship?.length == 0 ? null : data?.relationship,
      },
      'aboutMe': data?.aboutMe,
      'homeTown': data?.homeTown,
      'coverImage': data?.coverImage?.length !== 0 ? data?.coverImage : DEFAULT_COVER,
      'userNumber': profileFeId?.userId,
      'avataphoto': data?.avataphoto?.length !== 0 ? data?.avataphoto : DEFAULT_AVATAR,
      'userSetting': [{
        'settingId': null
      }],
      'interes': data?.interest?.length !== 0 ? data?.interest?.map(e => ({ interestId: e })) : [{ 'interestId': null }],
      'workPlace': [{
        'workPlaceName': data?.workPlace,
      }],
      'webAffilication': [{
        'webAffiliationUrl': null
      }]
    }
    const submitData2 = {
      'userId': profileFeId?.userId,
      "firstName": data?.firstName,
      "lastName": data?.lastName,
      "email": data?.email,
      "avata": data?.avataphoto?.length !== 0 ? data?.avataphoto : DEFAULT_AVATAR,
    }
    const submitUpdateAdmin = {
      "adminId": profileFeId?.userId,
      "roleName": profileFeId?.role,
      "fullName": data?.firstName + data?.lastName,
      "email": profileFeId?.email
    }
    // console.log(initialSubmitData)
    toast.promise(
      (async () => {
        if (isAdmin) {
          await createAdminProfile(submitUpdateAdmin);
        } else {
          await createByLogin(submitData1);
        }
      })(),
      {
        pending: 'Creating...',
        success: 'Account created!'
      }
    )
      .then(() => {
        (async () => {
          if (data?.avataphoto) {
            await createPost({
              "userStatusId": listStatus.find(e => e?.statusName == "Public")?.userStatusId,
              "isAvataPost": true,
              "content": "",
              "photos": [
                {
                  "photoUrl": data?.avataphoto,
                  "position": 0
                }
              ],
            })
          }
          if (data?.coverImage) {
            await createPost({
              "userStatusId": listStatus.find(e => e?.statusName == "Public")?.userStatusId,
              "isCoverPhotoPost": true,
              "content": "",
              "photos": [
                {
                  "photoUrl": data?.coverImage,
                  "position": 0
                }
              ],
            })
          }
        })()
      })
      .then(() => {
        !isAdmin && createUserChat(submitData2)
        navigate(isAdmin ? '/dashboard' : '/')
      })
  }

  return (
    <div className={` ${step !== 0 && 'img-bg2'} w-screen h-screen flex flex-col items-center justify-center overflow-hidden`}>
      {step == 0 && <Step0 handleNext={handleNext} />}
      {
        step !== 0 && isAdmin &&
        <div className='relative min-w-[16rem] min-h-[23rem] h-fit w-[80%] md:w-[70%] lg:w-[55%] bg-white rounded-2xl shadow-4edges '>
          <form ref={formRef} className='h-full' id='formSubmit' onSubmit={handleSubmit(submitData)}>
            <AdminUpdate profileFeId={profileFeId} register={register} errors={errors} submitForm={() => formRef.current.requestSubmit()} />
          </form>
        </div>
      }
      {
        step !== 0 && isOther &&
        <div className='relative min-w-[16rem] min-h-[25rem] h-fit w-[80%] md:w-[70%] lg:w-[55%] bg-white rounded-2xl shadow-4edges '>
          <form ref={formRef} className='h-full' id='formSubmit' onSubmit={handleSubmit(submitData)}>{renderSteps()}</form>
          {step !== 0 &&
            <Progress handleNext={handleNext} handlePrev={handlePrev} processWidth={processWidth}
              step={step} isValid={isValid} submitForm={() => formRef.current.requestSubmit()} />
          }
        </div>
      }


    </div>
  )
}
export default FirstTimeLogin
