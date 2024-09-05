import { IconCaretLeftFilled, IconCaretRightFilled, IconCircleCheck } from '@tabler/icons-react'

function Progress({ handlePrev, handleNext, step, processWidth, isValid, submitForm }) {
  return <div className='absolute top-0 -translate-y-8 w-full h-6 flex justify-between items-center px-2 pb-2'>
    <button
      className='text-white bg-blue-500 hover:bg-blue-700 h-10 min-w-10 flex justify-center items-center gap-5 rounded-[50%] font-bold'
      onClick={handlePrev}
    >
      <IconCaretLeftFilled className='h-8 w-8' />
    </button>
    <div className=' w-full mx-5 flex justify-between items-center relative before:absolute before:bg-fbWhite before:h-1 before:w-[95%] be
          before:top-[50%] before:left-1 before:-translate-y-[50%]'>
      <div className='bg-green-700 absolute left-0 top-[50%] -translate-y-[50%] h-1 transition-all duration-800 ease-in'
        style={{ width: `${processWidth()}%` }}></div>
      <div className={`circle ${step >= 1 && 'active'}`}>1</div>
      <div className={`circle ${step >= 2 && 'active'}`}>2</div>
      <div className={`circle ${step >= 3 && 'active'}`}>3</div>
    </div>
    {step !== 3 ?
      <button
        className={`text-white bg-blue-500 hover:bg-blue-700 ${!isValid && 'bg-red-500 hover:bg-red-700'} h-10 min-w-10 flex justify-center items-center gap-5 rounded-[50%] font-bold`}
        disabled={!isValid}
        type='button'
        onClick={handleNext}
      >
        <IconCaretRightFilled className='h-8 w-8' />
      </button>
      :
      <button className='interceptor-loading text-white bg-blue-500 hover:bg-blue-700 h-10 min-w-10 flex justify-center items-center gap-5 rounded-[50%] font-bold'
        onClick={submitForm}
      >
        <IconCircleCheck className='h-8 w-8' />
      </button>
    }
  </div>
}

export default Progress
