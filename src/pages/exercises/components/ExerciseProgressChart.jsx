import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, 
    Tooltip, ResponsiveContainer 
} from 'recharts';

const ExerciseProgressChart = ({ data }) => {
    return (
        <div className="bg-white dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-900 rounded-[2rem] p-6 shadow-sm mb-6 overflow-hidden">
            {/* Header con el estilo de tus otras tarjetas */}
            <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.3em] leading-none">
                        DATA / EVOLUCIÓN
                    </span>
                    <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase italic tracking-tighter leading-none">
                        Progreso de Carga
                    </h3>
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-900 px-3 py-1.5 rounded-xl border border-zinc-200 dark:border-zinc-800">
                    <span className="text-[9px] font-black text-zinc-500 dark:text-zinc-400 uppercase tracking-widest">
                        Unidad: KG
                    </span>
                </div>
            </div>

            <div className="w-full" style={{ height: '220px', minWidth: '0px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart 
                        data={data} 
                        /* 1. AJUSTE DE MÁRGENES: 
                        Aumentamos 'left' para que el eje Y no se corte y 
                        'right' para que el último punto respire */
                        margin={{ top: 10, right: 25, left: -25, bottom: 0 }}
                    >
                        <defs>
                            <linearGradient id="zincGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        
                        <CartesianGrid 
                            strokeDasharray="4 4" 
                            vertical={false} 
                            stroke="#27272a" 
                            opacity={0.2} 
                        />
                        
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            /* 2. PADDING EN EL EJE X: Evita que el primer y último texto se corten */
                            padding={{ left: 10, right: 10 }}
                            tick={{fontSize: 9, fontWeight: '900', fill: '#52525b', textTransform: 'uppercase'}}
                            dy={15}
                        />
                        
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            /* 3. ALINEACIÓN: Aseguramos que los números de peso tengan espacio */
                            tick={{fontSize: 9, fontWeight: '900', fill: '#52525b'}}
                            domain={['dataMin - 5', 'dataMax + 5']} 
                        />

                        <Tooltip 
                            /* 4. MEJORA DEL CURSOR: Línea más fina para no tapar el dato */
                            cursor={{ stroke: '#2563eb', strokeWidth: 1, strokeDasharray: '4 4' }}
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length) {
                                    return (
                                        <div className="bg-zinc-900 dark:bg-white p-3 rounded-2xl shadow-2xl border border-zinc-800 dark:border-zinc-200 animate-in zoom-in-95 duration-200 z-50">
                                            <p className="text-[8px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-tighter mb-1">FECHA: {label}</p>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-xl font-black text-white dark:text-black italic tracking-tighter leading-none">
                                                    {payload[0].value}
                                                </span>
                                                <span className="text-[10px] font-black text-blue-500 uppercase">kg</span>
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                        />

                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#2563eb" 
                            strokeWidth={4} 
                            fill="url(#zincGradient)" 
                            /* 5. DOTS: Bajamos un pelín el radio para que no toquen el borde superior */
                            dot={{ 
                                r: 4, 
                                fill: "#09090b", 
                                stroke: "#2563eb", 
                                strokeWidth: 2.5 
                            }}
                            activeDot={{ 
                                r: 6, 
                                fill: "#2563eb", 
                                stroke: "#fff", 
                                strokeWidth: 2,
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>

            {/* Footer técnico */}
            <div className="mt-8 pt-4 border-t border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.3em]">Sistema de Registro v1.0</span>
                <div className="h-1.5 w-12 bg-zinc-100 dark:bg-zinc-900 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-600 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default ExerciseProgressChart;
