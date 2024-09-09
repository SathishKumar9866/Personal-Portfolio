import { PropsWithChildren } from "react"

export const HeroOrbit =({
    children, size
} : PropsWithChildren<{size:number}>) => {
    <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-red-500  size-[800px]  '>
        <div className='border border-red-500 size-[800px]  '
        style={{ 
            height:`${size}px`,
            width:`${size}px`,
        }}>   
            {children}       
        </div>
    </div>
}