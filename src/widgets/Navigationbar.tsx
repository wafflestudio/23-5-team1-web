import { useNavigate } from "react-router-dom";

const Navigationbar = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            width: '80%',
            padding: "20px 80px",
            justifyContent: 'center',
            alignContent: 'start'
        }}>
            <button 
                type='button' 
                onClick={()=>navigate('/main')}
            style={{ 
                background: "none",
                borderWidth: 0,
                width: "100%",
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                alignContent: 'center',
            }}>
                <img src="/assets/logo.png" style={{ width: 35, aspectRatio: 1 }} alt="calendar icon with snu mark on it"/>
                <div style={{ fontSize: 25, fontWeight: 500 }}>행샤</div>
            </button>
        </div>
     )
}

export default Navigationbar;