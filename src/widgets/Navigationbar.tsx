import { useNavigate } from "react-router-dom";

const Navigationbar = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            width: '80%',
            padding: "20px 80px",
            justifyContent: 'center',
            alignContent: 'start',
            zIndex: 20,
            outline: 'none',
        }}>
            <button 
                type='button' 
                onClick={()=>navigate('/main')}
            style={{ 
                background: "none",
                borderWidth: 0,
                display: "flex",
                flexDirection: "row",
                gap: "5px",
                alignContent: 'center',
                cursor: 'pointer'
            }}>
                <img src="/assets/logo.png" style={{ width: 35, aspectRatio: 1 }} alt="calendar icon with snu mark on it"/>
                <div style={{ fontSize: 25, fontWeight: 500 }}>행샤</div>
            </button>
        </div>
     )
}

export default Navigationbar;