import * as React from "react"
import { SVGProps } from "react"

export const AddIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg
        width={30}
        height={30}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
            d="M15 3C8.373 3 3 8.372 3 15s5.373 12 12 12 12-5.372 12-12S21.627 3 15 3Zm0 21.818c-5.422 0-9.818-4.396-9.818-9.818S9.578 5.182 15 5.182 24.818 9.578 24.818 15 20.422 24.818 15 24.818Zm4.364-10.909H16.09v-3.273a1.09 1.09 0 1 0-2.182 0v3.273h-3.273a1.09 1.09 0 1 0 0 2.182h3.273v3.273a1.09 1.09 0 1 0 2.182 0V16.09h3.273a1.09 1.09 0 1 0 0-2.182Z"
            fill="#CCC"
        />
    </svg>
)