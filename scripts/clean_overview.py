lines = open('src/admin/pages/Overview.jsx', encoding='utf-8').readlines()

new_block = """                <div className="text-right">
                  <span
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sans border shadow-xs ${
                      p.stock === 0
                        ? 'bg-[#FCE7E6] border-garnet/30 text-garnet'
                        : p.stock <= 3
                        ? 'bg-[#F8EEDB] border-[#D1AF73] text-[#2A2019]'
                        : 'bg-[#FFF5E0] border-[#E0B554] text-[#7A5408]'
                    }`}
                  >
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} units left`}
                  </span>
                  <p className="text-xs font-sans font-bold text-ink mt-0.5">
                    {formatCurrency(p.price)}
                  </p>
                </div>
"""

# Replace lines 402 to 423 (0-indexed: 402 to 423)
start_idx = -1
for i, l in enumerate(lines):
    if '<div className="text-right">' in l:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if '{formatCurrency(p.price)}' in lines[i]:
        end_idx = i + 2 # include closing </p> and </div>
        break

print(f"Replacing lines {start_idx} to {end_idx}")
lines = lines[:start_idx] + [new_block] + lines[end_idx:]

with open('src/admin/pages/Overview.jsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Overview.jsx successfully cleaned!")
