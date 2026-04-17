import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ExerciseProgressChart = ({ data }) => {
    return (
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-[2.5rem] border border-zinc-100 dark:border-zinc-900 shadow-sm">
            <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-6 italic">
                Evolución de Carga
            </h3>
            
            <div className="w-full" style={{ height: '220px', minWidth: '0px' }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart 
                        data={data} 
                        margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" opacity={0.3} />
                        
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fontSize: 10, fontWeight: '900', fill: '#71717a'}}
                            dy={10}
                        />
                        
                        <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{fontSize: 10, fontWeight: '900', fill: '#71717a'}}
                            domain={['dataMin - 2', 'dataMax + 2']} 
                        />

                        <Tooltip 
                            cursor={{ stroke: '#3b82f6', strokeWidth: 2, strokeDasharray: '5 5' }}
                            contentStyle={{ 
                                backgroundColor: '#18181b', 
                                border: '1px solid #3f3f46', 
                                borderRadius: '16px',
                                padding: '10px 14px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
                            }}
                            itemStyle={{ 
                                color: '#3b82f6', 
                                fontSize: '14px',
                                fontWeight: '900',
                                textTransform: 'uppercase'
                            }}
                            labelStyle={{
                                color: '#a1a1aa',
                                fontSize: '10px',
                                marginBottom: '4px',
                                fontWeight: 'bold'
                            }}
                            formatter={(value) => [`${value} KG`, 'PESO MÁX']}
                        />

                        <Line 
                            type="monotone" 
                            dataKey="maxWeight" 
                            stroke="#3b82f6" 
                            strokeWidth={4} 
                            dot={{ 
                                r: 5, 
                                fill: "#f4f4f5",
                                stroke: "#3b82f6", 
                                strokeWidth: 3 
                            }}
                            activeDot={{ 
                                r: 7, 
                                fill: "#3b82f6", 
                                stroke: "#fff", 
                                strokeWidth: 2 
                            }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default ExerciseProgressChart;