"use client"
import { MinusSquareSmall, PlusSquareSmall } from "geist-icons";

export default function SampleTable ({ lang }: {
    lang: "en" | "es"
}) {
    return (
        <div className="text-black min-w-[370px] max-w-[516px] bg-white rounded-xl grid grid-cols-[150px_150px] sm:grid-cols-[150px_1fr] gap-2 sm:gap-4 p-4 sm:p-8 w-fit h-fit shadow-xl overflow-hidden">
            <div aria-label="sample-column-buttons" className="col-start-1 flex flex-row gap-1 w-fit">
                <div aria-label="sample-button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none border-[#e4e4e7] bg-[#f4f4f5] text-[black] data-[hover=true]:opacity-hover">
                    { lang === "es" ? "Eliminar Columna" : "Delete Column" }
                    <span className="w-[20px] h-[20px]">
                        <MinusSquareSmall />
                    </span>
                </div>
                <div aria-label="sample-button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none border-[#e4e4e7] bg-[#f4f4f5] text-[black] data-[hover=true]:opacity-hover">
                    { lang === "es" ? "Añadir Columna" : "Add Column" }
                    <span className="w-[20px] h-[20px]">
                        <PlusSquareSmall color="#66aaf9"/>
                    </span>
                </div>
            </div>
            <div aria-label="sample-row-buttons" className="col-start-1 flex flex-col gap-1">
                <div aria-label="sample-button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none border-[#e4e4e7] bg-[#f4f4f5] text-[black] data-[hover=true]:opacity-hover">
                    { lang === "es" ? "Eliminar Fila" : "Delete Row" }
                    <span className="w-[20px] h-[20px]">
                        <MinusSquareSmall />
                    </span>
                </div>
                <div aria-label="sample-button" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none border-[#e4e4e7] bg-[#f4f4f5] text-[black] data-[hover=true]:opacity-hover">
                    { lang === "es" ? "Añadir Fila" : "Add Row" }
                    <span className="w-[20px] h-[20px]">
                        <PlusSquareSmall color="#66aaf9"/>
                    </span>
                </div>
            </div>

            <div aria-label="sample-table" className="col-start-2 row-start-2 w-[286px] overflow-hidden flex flex-col gap-2">
                <div className="flex flex-row gap-2 pl-[15px] w-fit">
                    <div className="text-tiny font-bold w-[120px] sm:w-[155.88px] text-center">A</div>
                    <div className="text-tiny font-bold w-[120px] sm:w-[155.88px] text-center">B</div>
                    <div className="text-tiny font-bold w-[120px] sm:w-[155.88px] text-center">C</div>
                </div>
                <div aria-label="sample-row" className="flex flex-row items-center gap-2 w-[500px]">
                    <span className="text-tiny font-bold">0</span>
                    
                    <div aria-label="sample-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[200px] h-[40px] is-filled">
                        <div aria-label="sample-input-inner" className="inline-flex w-full items-center h-full box-border">
                            <div aria-label="sample-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled">
                            { lang === "es" ? "Empleado" : "Employee" }
                            </div>
                        </div>
                    </div>
                    
                    <div aria-label="sample-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[200px] h-[40px] is-filled">
                        <div aria-label="sample-input-inner" className="inline-flex w-full items-center h-full box-border">
                            <div aria-label="sample-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled">
                            { lang === "es" ? "Lunes" : "Monday" }
                            </div>
                        </div>
                    </div>

                    <div aria-label="sample-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[200px] h-[40px] is-filled">
                        <div aria-label="sample-input-inner" className="inline-flex w-full items-center h-full box-border">
                            <div aria-label="sample-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled">
                            { lang === "es" ? "Martes" : "Tuesday" }
                            </div>
                        </div>
                    </div>
                </div>
                
                <div aria-label="sample-row" className="flex flex-row items-center gap-2 w-[730px]">
                    <span className="text-tiny font-bold">1</span>
                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border"> 
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled">
                            José Solá
                            </div>
                        </div>
                    </div>

                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-transparent data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled border-2 border-[#e4e4e7]">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border"> 
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled border-[#e4e4e7]">
                            
                            </div>
                        </div>
                    </div>

                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-transparent data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled border-2 border-[#e4e4e7]">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border"> 
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled border-[#e4e4e7]">
                            
                            </div>
                        </div>
                    </div>
                </div>

                <div aria-label="sample-row" className="flex flex-row items-center gap-2 w-[730px]">
                    <span className="text-tiny font-bold">2</span>
                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border">
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled">
                            Keith Pace
                            </div>
                        </div>
                    </div>

                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-transparent data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled border-2 border-[#e4e4e7]">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border"> 
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled border-[#e4e4e7]">
                            
                            </div>
                        </div>
                    </div>

                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-transparent data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled border-2 border-[#e4e4e7]">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border"> 
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled border-[#e4e4e7]">
                            
                            </div>
                        </div>
                    </div>
                    
                </div>

                <div aria-label="sample-row" className="flex flex-row items-center gap-2 w-[730px]">
                    <span className="text-tiny font-bold">3</span>
                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-[#f4f4f5] data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border">
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled">
                            Chase Duncan
                            </div>
                        </div>
                    </div>

                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-transparent data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled border-2 border-[#e4e4e7]">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border"> 
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled border-[#e4e4e7]">
                            
                            </div>
                        </div>
                    </div>

                    <div aria-label="sample-header-input-wrapper" className="relative inline-flex tap-highlight-transparent flex-row items-center shadow-sm px-3 gap-3 bg-transparent data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 min-h-10 rounded-medium transition-background motion-reduce:transition-none !duration-150 outline-none group-data-[focus-visible=true]:z-10 group-data-[focus-visible=true]:ring-2 group-data-[focus-visible=true]:ring-focus group-data-[focus-visible=true]:ring-offset-2 group-data-[focus-visible=true]:ring-offset-background w-[120px] sm:w-[155.88px] h-[40px] is-filled border-2 border-[#e4e4e7]">
                        <div aria-label="sample-header-input-inner" className="inline-flex w-full items-center h-full box-border"> 
                            <div aria-label="sample-header-input" className="w-full font-normal bg-transparent !outline-none placeholder:text-foreground-500 focus-visible:outline-none data-[has-start-content=true]:ps-1.5 data-[has-end-content=true]:pe-1.5 file:cursor-pointer file:bg-transparent file:border-0 autofill:bg-transparent bg-clip-text text-small group-data-[has-value=true]:text-default-foreground is-filled border-[#e4e4e7]">
                            
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}