import * as React from "react"
import { SVGProps } from "react"

export const ConfigIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        {...props}
        width={30}
        height={30}
        viewBox="0 0 30 30"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M15 18.75C17.0711 18.75 18.75 17.0711 18.75 15C18.75 12.9289 17.0711 11.25 15 11.25C12.9289 11.25 11.25 12.9289 11.25 15C11.25 17.0711 12.9289 18.75 15 18.75Z"
            stroke="black"
            strokeWidth={1.875}
            strokeMiterlimit={10}
            strokeLinecap="round"
        />
        <path
            d="M26.0231 9.71813L25.0856 8.09437C24.5681 7.19719 23.4216 6.89062 22.5244 7.40812L22.0313 7.69313C20.1563 8.775 17.8125 7.42219 17.8125 5.2575V4.6875C17.8125 3.65156 16.9734 2.8125 15.9375 2.8125H14.0625C13.0266 2.8125 12.1875 3.65156 12.1875 4.6875V5.2575C12.1875 7.42219 9.84376 8.77594 7.96876 7.69313L7.47563 7.40812C6.57844 6.89062 5.43188 7.19719 4.91438 8.09437L3.97688 9.71813C3.45938 10.6153 3.76594 11.7619 4.66313 12.2794L5.15626 12.5644C7.03126 13.6472 7.03126 16.3528 5.15626 17.4356L4.66313 17.7206C3.76594 18.2381 3.45938 19.3847 3.97688 20.2819L4.91438 21.9056C5.43188 22.8028 6.57844 23.1094 7.47563 22.5919L7.96876 22.3069C9.84376 21.2241 12.1875 22.5778 12.1875 24.7425V25.3125C12.1875 26.3484 13.0266 27.1875 14.0625 27.1875H15.9375C16.9734 27.1875 17.8125 26.3484 17.8125 25.3125V24.7425C17.8125 22.5778 20.1563 21.2241 22.0313 22.3069L22.5244 22.5919C23.4216 23.1094 24.5681 22.8028 25.0856 21.9056L26.0231 20.2819C26.5406 19.3847 26.2341 18.2381 25.3369 17.7206L24.8438 17.4356C22.9688 16.3528 22.9688 13.6472 24.8438 12.5644L25.3369 12.2794C26.2341 11.7619 26.5416 10.6153 26.0231 9.71813Z"
            stroke="black"
            strokeWidth={1.875}
            strokeMiterlimit={10}
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
)