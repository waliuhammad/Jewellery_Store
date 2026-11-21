# Clean Overview.jsx and Transactions.jsx

overview_path = 'src/admin/pages/Overview.jsx'
with open(overview_path, 'r', encoding='utf-8') as f:
    text = f.read()

bad_overview = """                <div className="text-right">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[11px] font-medium font-sans ${
                    className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold font-sans border shadow-xs ${
                      p.stock === 0
                        ? 'bg-[#F3D9D6] text-garnet'
                        : p.stock <= 3
                        ? 'bg-champagne/80 text-ink'
                        : 'bg-[#F6E9CF] text-[#8A6A1F]'
                        ? 'bg-[#F8EEDB] border-[#D1AF73] text-[#2A2019]'
                        : 'bg-[#FFF5E0] border-[#E0B554] text-[#7A5408]'
                    }`}
                  >
                    {p.stock === 0 ? 'Out of stock' : `${p.stock} units left`}
                  </span>
                  <p className="text-xs font-sans font-medium text-taupe mt-0.5">
                  <p className="text-xs font-sans font-bold text-ink mt-0.5">
                    {formatCurrency(p.price)}
                  </p>
                </div>"""

good_overview = """                <div className="text-right">
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
                </div>"""

# Replace normalizing CRLF
text = text.replace('\r\n', '\n')
bad_overview = bad_overview.replace('\r\n', '\n')
good_overview = good_overview.replace('\r\n', '\n')

if bad_overview in text:
    text = text.replace(bad_overview, good_overview)
    with open(overview_path, 'w', encoding='utf-8') as f:
        f.write(text)
    print("Fixed Overview.jsx")
else:
    print("Warning: bad_overview not matched exactly")

# Now Transactions.jsx
tx_path = 'src/admin/pages/Transactions.jsx'
with open(tx_path, 'r', encoding='utf-8') as f:
    tx_text = f.read().replace('\r\n', '\n')

bad_tx = """                    <td className="py-3.5 px-3 text-ivory/70">{formatDate(tx.date)}</td>
                    <td className="py-3.5 px-3 font-mono font-semibold text-right text-champagne">
                    <td className="py-3.5 px-3 text-ivory/80 font-medium">{formatDate(tx.date)}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-right text-champagne">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-medium font-sans uppercase tracking-wider ${
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans uppercase tracking-wider ${
                          tx.status === 'paid'
                            ? 'bg-[#3F6B45]/30 text-[#A2D9AB] border border-[#3F6B45]'
                            ? 'bg-[#3F6B45]/40 text-[#A2D9AB] border border-[#78B87B]'
                            : tx.status === 'pending'
                            ? 'bg-[#8A6A1F]/30 text-[#F6E9CF] border border-[#8A6A1F]'
                            : 'bg-[#A33B3B]/30 text-[#F3D9D6] border border-[#A33B3B]'
                            ? 'bg-[#8A6A1F]/40 text-[#F6E9CF] border border-[#D4A034]'
                            : 'bg-[#A33B3B]/40 text-[#FCE6E5] border border-[#E5918F]'
                        }`}
                      >"""

good_tx = """                    <td className="py-3.5 px-3 text-ivory/80 font-medium">{formatDate(tx.date)}</td>
                    <td className="py-3.5 px-3 font-mono font-bold text-right text-champagne">
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold font-sans uppercase tracking-wider ${
                          tx.status === 'paid'
                            ? 'bg-[#3F6B45]/40 text-[#A2D9AB] border border-[#78B87B]'
                            : tx.status === 'pending'
                            ? 'bg-[#8A6A1F]/40 text-[#F6E9CF] border border-[#D4A034]'
                            : 'bg-[#A33B3B]/40 text-[#FCE6E5] border border-[#E5918F]'
                        }`}
                      >"""

bad_tx = bad_tx.replace('\r\n', '\n')
good_tx = good_tx.replace('\r\n', '\n')

if bad_tx in tx_text:
    tx_text = tx_text.replace(bad_tx, good_tx)
    with open(tx_path, 'w', encoding='utf-8') as f:
        f.write(tx_text)
    print("Fixed Transactions.jsx")
else:
    print("Warning: bad_tx not matched exactly")
