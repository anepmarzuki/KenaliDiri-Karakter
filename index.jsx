import { useState, useMemo } from "react";

const CHARS = {
  1: { name: "Fikiran & Keazaman", sub: "Pemimpin Visioner" },
  2: { name: "Perihatin & Komunikasi", sub: "Penghubung Jiwa" },
  3: { name: "Gerak & Spiritual", sub: "Penggerak Strategi" },
  4: { name: "Ilmu & Perancangan", sub: "Perancang Bijaksana" },
  5: { name: "Keyakinan & Ketegasan", sub: "Pemimpin Berkarisma" },
  6: { name: "Rezeki & Keluarga", sub: "Penjana Kekayaan" },
  7: { name: "Sosial & Networking", sub: "Penghubung Masyarakat" },
  8: { name: "Tanggungjawab & Komitmen", sub: "Pekerja Keras" },
  9: { name: "Imej & Kejayaan", sub: "Insan Harmoni" },
};

function reduce(n) {
  n = Math.abs(Math.floor(n));
  if (n === 0) return 9;
  while (n > 9) n = String(n).split("").reduce((a, b) => a + Number(b), 0);
  return n;
}

function adjustDate(day, month, year) {
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() - 1);
  return { day: d.getDate(), month: d.getMonth() + 1, year: d.getFullYear() };
}

function calc(day, month, year, isNight) {
  if (isNight) {
    const adj = adjustDate(day, month, year);
    day = adj.day; month = adj.month; year = adj.year;
  }
  const y1 = Math.floor(year / 100), y2 = year % 100;
  const A = reduce(day), B = reduce(month), C = reduce(y1), D = reduce(y2);
  const E = reduce(A + B), F = reduce(C + D);
  const G = reduce(E + F), H = reduce(B + C), I = reduce(G + H);
  const oi = reduce(A + E), oii = reduce(B + E), oiii = reduce(C + F), oiv = reduce(D + F);
  const ov = reduce(oi + oii + G), ovi = reduce(oiii + oiv + G);

  // Pick 4 unique kekuatan in priority order G,H,E,A,F,I
  const order = [G, H, E, A, F, I];
  const kekuatan = [];
  const seen = new Set();
  for (const val of order) {
    if (!seen.has(val)) {
      kekuatan.push(val);
      seen.add(val);
      if (kekuatan.length === 4) break;
    }
  }

  // All inner values for cabaran check
  const allInner = new Set([G, H, E, A, F, I]);

  // Tambahan: repeated 2x+ in outer (i-vi only), not already in displayed kekuatan
  const outerOnly = [oi, oii, oiii, oiv, ov, ovi];
  const freq = {};
  outerOnly.forEach(v => { freq[v] = (freq[v] || 0) + 1; });
  const kekuatanSet = new Set(kekuatan);
  const tambahan = Object.entries(freq)
    .filter(([k, c]) => c >= 2 && !kekuatanSet.has(Number(k)))
    .map(([k]) => Number(k));

  // Jalan keajaiban: codes not in any inner position
  const jalanKeajaiban = [];
  for (let i = 1; i <= 9; i++) {
    if (!allInner.has(i)) jalanKeajaiban.push(i);
  }

  return { kekuatan, tambahan, jalanKeajaiban, adjustedDay: day, adjustedMonth: month, adjustedYear: year };
}

function NumBadge({ num, size = 34, variant = "solid" }) {
  const styles = {
    solid: { background: "#1B2A4A", color: "#fff", border: "none" },
    outline: { background: "#fff", color: "#1B2A4A", border: "1.5px dashed #bbb" },
    keajaiban: { background: "#f0f0f0", color: "#555", border: "1.5px solid #ccc" },
  };
  const s = styles[variant];
  return (
    <div style={{
      width: size, height: size, borderRadius: size, flexShrink: 0,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontWeight: 700, fontSize: size * 0.44, ...s,
    }}>{num}</div>
  );
}

export default function App() {
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [isNight, setIsNight] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const valid = day >= 1 && day <= 31 && month >= 1 && month <= 12 && year >= 1900 && year <= 2030;
  const data = useMemo(() => valid ? calc(Number(day), Number(month), Number(year), isNight) : null, [day, month, year, isNight, valid]);

  const labels = ["Kekuatan Paling Dominan", "Kekuatan Kedua", "Kekuatan Ketiga", "Kekuatan Keempat"];

  function handleCalc() { if (valid) setShowResult(true); }
  function handleReset() { setShowResult(false); setDay(""); setMonth(""); setYear(""); setIsNight(false); }

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif", maxWidth: 460, margin: "0 auto", color: "#1a1a1a" }}>

      {/* Header */}
      <div style={{ textAlign: "center", padding: "28px 16px 22px", background: "#1B2A4A", borderRadius: "0 0 20px 20px" }}>
        <div style={{ color: "#C9A84C", fontSize: 11, fontWeight: 700, letterSpacing: 4, marginBottom: 8 }}>METALIFE</div>
        <div style={{ color: "#fff", fontSize: 21, fontWeight: 700 }}>Kalkulator Karakter Diri</div>
      </div>

      {!showResult ? (
        <div style={{ padding: "16px 20px 28px" }}>
          <div style={{ background: "#fff", borderRadius: 14, padding: 24, marginTop: 12, border: "1px solid #e8e8e8" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18, color: "#1B2A4A" }}>Masukkan Tarikh Lahir</div>

            <div style={{ display: "flex", gap: 10 }}>
              {[
                { label: "Hari", val: day, set: setDay, ph: "DD" },
                { label: "Bulan", val: month, set: setMonth, ph: "MM" },
                { label: "Tahun", val: year, set: setYear, ph: "YYYY" },
              ].map(f => (
                <div key={f.label} style={{ flex: f.label === "Tahun" ? 1.6 : 1 }}>
                  <div style={{ fontSize: 11, color: "#888", marginBottom: 4, fontWeight: 600 }}>{f.label}</div>
                  <input
                    type="number" placeholder={f.ph} value={f.val}
                    onChange={e => f.set(e.target.value)}
                    style={{
                      width: "100%", padding: "13px 8px", border: "1.5px solid #ddd", borderRadius: 10,
                      fontSize: 18, textAlign: "center", fontWeight: 700, outline: "none",
                      background: "#fafafa", color: "#1B2A4A", boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#1B2A4A"; e.target.style.background = "#fff"; }}
                    onBlur={e => { e.target.style.borderColor = "#ddd"; e.target.style.background = "#fafafa"; }}
                  />
                </div>
              ))}
            </div>

            <div
              onClick={() => setIsNight(!isNight)}
              style={{
                marginTop: 16, padding: "12px 14px", borderRadius: 10, cursor: "pointer",
                background: isNight ? "#1B2A4A" : "#fafafa",
                border: `1.5px solid ${isNight ? "#1B2A4A" : "#ddd"}`,
                display: "flex", alignItems: "center", gap: 12,
              }}
            >
              <div style={{
                width: 20, height: 20, borderRadius: 5,
                border: `2px solid ${isNight ? "#C9A84C" : "#ccc"}`,
                background: isNight ? "#C9A84C" : "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, color: "#fff", fontWeight: 700, flexShrink: 0,
              }}>{isNight ? "✓" : ""}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isNight ? "#fff" : "#1B2A4A" }}>
                  Lahir antara 12 tengah malam hingga Subuh
                </div>
                <div style={{ fontSize: 11, color: isNight ? "#ffffff77" : "#aaa", marginTop: 1 }}>
                  Tarikh akan dikira sebagai hari sebelumnya
                </div>
              </div>
            </div>

            <button
              onClick={handleCalc} disabled={!valid}
              style={{
                width: "100%", marginTop: 20, padding: "14px", border: "none", borderRadius: 12,
                background: valid ? "#1B2A4A" : "#e0e0e0",
                color: valid ? "#fff" : "#999", fontSize: 15, fontWeight: 700,
                cursor: valid ? "pointer" : "default",
              }}
            >Analisa Karakter Saya</button>
          </div>
        </div>
      ) : data && (
        <div style={{ padding: "12px 18px 28px" }}>

          {isNight && (
            <div style={{
              marginTop: 10, padding: "10px 14px", background: "#f5f5f5", borderRadius: 10,
              fontSize: 12, color: "#666", textAlign: "center", border: "1px solid #e0e0e0",
            }}>
              Tarikh dikira: <strong>{data.adjustedDay}/{data.adjustedMonth}/{data.adjustedYear}</strong> (tolak 1 hari)
            </div>
          )}

          {/* ─── KEKUATAN DIRI ─── */}
          <div style={{ marginTop: 16 }}>
            <div style={{
              fontSize: 13, fontWeight: 700, color: "#1B2A4A", letterSpacing: 1.5,
              marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #1B2A4A",
              textTransform: "uppercase",
            }}>Kekuatan Diri</div>

            {data.kekuatan.map((val, idx) => {
              const c = CHARS[val];
              return (
                <div key={idx} style={{
                  display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                  background: "#fff", borderRadius: 12, marginBottom: 8,
                  border: "1px solid #e8e8e8",
                }}>
                  <NumBadge num={val} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: "#1B2A4A" }}>{c.name}</div>
                    <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{c.sub}</div>
                  </div>
                  <div style={{ fontSize: 10, color: "#aaa", fontWeight: 600, textAlign: "right", lineHeight: 1.4 }}>
                    {labels[idx]}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ─── KEKUATAN TAMBAHAN ─── */}
          {data.tambahan.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: "#1B2A4A", letterSpacing: 1.5,
                marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #C9A84C",
                textTransform: "uppercase",
              }}>Kekuatan Tambahan</div>

              {data.tambahan.map(num => {
                const c = CHARS[num];
                return (
                  <div key={num} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                    background: "#fff", borderRadius: 12, marginBottom: 6,
                    border: "1px dashed #ccc",
                  }}>
                    <NumBadge num={num} size={30} variant="outline" />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#1B2A4A" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{c.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ─── JALAN KEAJAIBAN ─── */}
          {data.jalanKeajaiban.length > 0 && (
            <div style={{ marginTop: 24 }}>
              <div style={{
                fontSize: 13, fontWeight: 700, color: "#1B2A4A", letterSpacing: 1.5,
                marginBottom: 12, paddingBottom: 8, borderBottom: "2px solid #999",
                textTransform: "uppercase",
              }}>Jalan Keajaiban</div>

              {data.jalanKeajaiban.map(num => {
                const c = CHARS[num];
                return (
                  <div key={num} style={{
                    display: "flex", alignItems: "center", gap: 14, padding: "12px 16px",
                    background: "#f7f7f7", borderRadius: 12, marginBottom: 6,
                    border: "1px solid #ddd",
                  }}>
                    <NumBadge num={num} size={30} variant="keajaiban" />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#444" }}>{c.name}</div>
                      <div style={{ fontSize: 12, color: "#888" }}>{c.sub}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <button onClick={handleReset} style={{
            width: "100%", marginTop: 28, padding: "14px", borderRadius: 12,
            border: "1.5px solid #1B2A4A", background: "transparent",
            color: "#1B2A4A", fontSize: 14, fontWeight: 700, cursor: "pointer",
          }}>Kira Semula</button>
        </div>
      )}
    </div>
  );
}
