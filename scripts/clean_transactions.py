tx_path = 'src/admin/pages/Transactions.jsx'
with open(tx_path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

clean_table = """        <div className="overflow-x-auto">
          <table className="w-full text-left font-sans text-xs">
            <thead>
              <tr className="border-b border-white/20 uppercase tracking-wider text-[11px] text-champagne font-bold">
                <th scope="col" className="py-3 px-3 font-bold">Order</th>
                <th scope="col" className="py-3 px-3 font-bold">Customer</th>
                <th scope="col" className="py-3 px-3 font-bold">Method / TID</th>
                <th scope="col" className="py-3 px-3 font-bold">Date</th>
                <th scope="col" className="py-3 px-3 font-bold text-right">Amount</th>
                <th scope="col" className="py-3 px-3 font-bold">Status</th>
                <th scope="col" className="py-3 px-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/15">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-ivory/70">
                    No transactions match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginated.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3.5 px-3 font-mono font-bold text-champagne">
                      {tx.orderNumber}
                    </td>
                    <td className="py-3.5 px-3 text-ivory font-medium">{tx.customerName}</td>
                    <td className="py-3.5 px-3">
                      <span className="font-semibold text-ivory">{tx.method}</span>
                      <span className="block font-mono text-[10px] text-ivory/70">{tx.tid}</span>
                    </td>
                    <td className="py-3.5 px-3 text-ivory/80 font-medium">{formatDate(tx.date)}</td>
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
                      >
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {tx.status !== 'paid' ? (
                        <button
                          onClick={() => handleMarkPaid(tx.id)}
                          className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-champagne text-noir rounded hover:bg-gold transition-colors"
                        >
                          Mark Paid
                        </button>
                      ) : (
                        <span className="text-[11px] text-ivory/60 font-medium italic">Settled</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
"""

start_idx = -1
for i, l in enumerate(lines):
    if '<div className="overflow-x-auto">' in l:
        start_idx = i
        break

end_idx = -1
for i in range(start_idx, len(lines)):
    if '<div className="pt-2">' in lines[i]:
        end_idx = i
        break

print(f"Replacing lines {start_idx} to {end_idx} in Transactions.jsx")
lines = lines[:start_idx] + [clean_table] + lines[end_idx:]

with open(tx_path, 'w', encoding='utf-8') as f:
    f.writelines(lines)

print("Transactions.jsx cleanly updated!")
