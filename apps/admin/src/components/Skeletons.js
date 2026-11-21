// Platzhalter, solange eine Seite lädt (Daten kommen von GitHub)
export function HeadSk({ actions = 0 }) {
  return (
    <div className="head">
      <div className="sk" style={{ width: 220, height: 34 }} />
      <div style={{ display: "flex", gap: 10 }}>
        {Array.from({ length: actions }, (_, i) => (
          <div key={i} className="sk" style={{ width: 130, height: 38, borderRadius: 99 }} />
        ))}
      </div>
    </div>
  );
}

export function ListSk({ rows = 7 }) {
  return (
    <div className="list">
      {Array.from({ length: rows }, (_, i) => (
        <div className="item" key={i}>
          <div className="sk" style={{ width: 88, height: 60, borderRadius: 4 }} />
          <div>
            <div className="sk" style={{ width: `${40 + ((i * 17) % 30)}%`, height: 16, marginBottom: 8 }} />
            <div className="sk" style={{ width: `${55 + ((i * 11) % 25)}%`, height: 12 }} />
          </div>
          <div className="sk" style={{ width: 120, height: 30, borderRadius: 99 }} />
        </div>
      ))}
    </div>
  );
}

export function FormSk() {
  const field = (w = "100%", h = 40) => (
    <div className="field">
      <div className="sk" style={{ width: 90, height: 11, marginBottom: 8 }} />
      <div className="sk" style={{ width: w, height: h }} />
    </div>
  );
  return (
    <>
      <div className="card">
        <div className="row">
          {field()}
          {field()}
          {field()}
        </div>
        {field("70%", 22)}
      </div>
      <div className="section">
        <div className="sk" style={{ width: 120, height: 22, marginBottom: 18 }} />
        <div className="row">
          {field()}
          {field()}
          {field()}
        </div>
        {field("100%", 90)}
        {field("100%", 220)}
      </div>
    </>
  );
}

export function CardsSk({ n = 5 }) {
  return (
    <div className="row">
      {Array.from({ length: n }, (_, i) => (
        <div className="card" key={i}>
          <div className="sk" style={{ width: "50%", height: 20, marginBottom: 10 }} />
          <div className="sk" style={{ width: "85%", height: 12 }} />
        </div>
      ))}
    </div>
  );
}
