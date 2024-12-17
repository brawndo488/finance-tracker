function Modal({show, onClose, children}){
    return <div style={{
        transform: show ? "translateX(0%)" : "translateX(-200%)", 
      }} className="absolute top-0 left-0 z-10 w-full h-full transition-all "> 
        <div className="contianer mx-auto max-w-2xl h-[80vh] rounded-3xl bg-slate-800 py-6 px-4">
          <button onClick={() => { 
              onClose(false);
            }}
            className="w-10 h-10 mb-4 font-bold rounded-full bg-slate-600">
            X
          </button>
          {children}
        </div>
      </div>
    

}

export default Modal; 