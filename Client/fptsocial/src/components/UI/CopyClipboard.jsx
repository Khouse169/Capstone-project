import { IconCopy, IconCopyCheck } from '@tabler/icons-react';
import { useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

const CopyToClipBoard = ({ textToCopy }) => {
  const [copied, setCopied] = useState(0)

  const handleCopy = () => {
    setCopied(true)
    toast.success('Copied to clipboard', { position: 'top-right' })
    setCopied(copied + 1)
  }

  return (
    <div>
      <CopyToClipboard text={textToCopy} onCopy={handleCopy}>
        <div>
          {copied == 0 ? <IconCopy className='text-gray-400 cursor-pointer' /> :
            <IconCopyCheck className='cursor-pointer' />
          }<span className={`text-xs text-gray-400 ${copied == 0 && 'invisible'}`}>Copied</span>
        </div>
      </CopyToClipboard>
    </div>
  );
};

export default CopyToClipBoard