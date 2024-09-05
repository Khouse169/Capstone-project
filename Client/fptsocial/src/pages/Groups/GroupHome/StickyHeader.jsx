import React, { useState, useEffect, useRef } from 'react';
import GroupAvatar from '~/components/UI/GroupAvatar';
import HeaderButton from './HearderButton';

const StickyHeader = ({ group }) => {
  const [isVisible, setIsVisible] = useState(false);
  const triggerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      { threshold: [1] }
    );

    if (triggerRef.current) {
      observer.observe(triggerRef.current);
    }

    return () => {
      if (triggerRef.current) {
        observer.unobserve(triggerRef.current);
      }
    };
  }, [])

  const scrollToTop = () => {
    const topElement = document.getElementById('top-profile');
    if (topElement) {
      topElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div ref={triggerRef} className="h-[1px]" />
      <div
        className={`sticky bg-white shadow-md flex justify-center top-0 z-50 transition-opacity duration-300 ${isVisible ? 'block' : 'hidden'}`}
      >
        <div className="py-1 px-2 w-[80%] md:w-[50%] flex gap-2 justify-between items-center">
          <div className='w-full p-2 rounded-md hover:bg-fbWhite flex gap-2 items-center cursor-pointer'
            onClick={scrollToTop}>
            <GroupAvatar avatarSrc={group?.coverImage} />
            <div className=' font-bold text-xl capitalize'>{group?.groupName}</div>
          </div>
          <HeaderButton group={group} />
        </div>

      </div>
    </>
  );
};

export default StickyHeader;