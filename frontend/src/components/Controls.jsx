export default function Controls({ q = 'Search destinations, activities, trips…', extra }) {
  return (
    <div className="tl-controls">
      <div className="tl-search">
        <span style={{ fontSize: 14 }}>⌕</span>
        <span>{q}</span>
      </div>
      <button className="tl-pill">Group by</button>
      <button className="tl-pill">Filter</button>
      <button className="tl-pill">Sort</button>
      {extra}
    </div>
  )
}
