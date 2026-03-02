import { 
    PieChart, 
    Pie, 
    Tooltip, 
    Legend, 
    ResponsiveContainer 
} from 'recharts';

const MacroPieChart = ({ namirnica }) => {
    if (!namirnica) {
        return <div className="text-center p-4">Odaberite namirnicu za prikaz makronutrijenata.</div>;
    }

    const data = [
        { 
            name: 'Proteini', 
            value: parseFloat(namirnica.proteini_na_100g),
            fill: '#3b82f6'
        },
        { 
            name: 'Ugljeni hidrati', 
            value: parseFloat(namirnica.ugljeni_hidrati_na_100g),
            fill: '#10b981'
        },
        { 
            name: 'Masti', 
            value: parseFloat(namirnica.masti_na_100g),
            fill: '#f59e0b'
        },
    ];

    return (
        <div style={{ width: '100%', height: 300 }}>
            <h4 className="text-center mb-2">{namirnica.naziv} - Makronutrijenti (100g)</h4>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60} 
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        nameKey="name"
                    />
                    <Tooltip formatter={(value) => `${value} g`} />
                    <Legend 
                        wrapperStyle={{ 
                            position: 'relative', 
                            marginTop: '10px',
                            paddingBottom: '10px'
                        }} 
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default MacroPieChart;