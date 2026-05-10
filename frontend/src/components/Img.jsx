export default function Img({ label, coord, ratio = '4 / 3', style, tone }) {
  return (
    <div
      className="tl-img"
      style={{ aspectRatio: ratio, ...style, ...(tone ? { background: tone } : {}) }}
    >
      {coord && <span className="tl-img-coord">{coord}</span>}
      {label && <span className="tl-img-label">{label}</span>}
    </div>
  )
}
