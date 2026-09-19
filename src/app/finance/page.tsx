'use client'

import React, { useState } from 'react'
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  ArrowRightLeft,
  Plus,
  Trash2,
  DollarSign,
  Building2,
  Smartphone,
  CreditCard,
} from 'lucide-react'
import { useApp } from '@/context/AppContext'
import { AccountType, TransactionType } from '@/lib/types'

export default function FinancePage() {
  const {
    accounts,
    transactions,
    addAccount,
    deleteAccount,
    addTransaction,
    deleteTransaction,
    getAccountBalance,
    getTotalNetWorth,
  } = useApp()

  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showTxModal, setShowTxModal] = useState(false)
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL')

  // Account Form
  const [accName, setAccName] = useState('')
  const [accType, setAccType] = useState<AccountType>('BANK')
  const [accBalance, setAccBalance] = useState('1000')
  const [accColor, setAccColor] = useState('#3b82f6')

  // Transaction Form
  const [txType, setTxType] = useState<TransactionType>('EXPENSE')
  const [txAmount, setTxAmount] = useState('')
  const [txCategory, setTxCategory] = useState('Food & Dining')
  const [txDesc, setTxDesc] = useState('')
  const [txAccountId, setTxAccountId] = useState(accounts[0]?.id || '')
  const [txToAccountId, setTxToAccountId] = useState(accounts[1]?.id || '')

  const filteredTransactions = transactions.filter(
    (tx) => filterType === 'ALL' || tx.type === filterType
  )

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (!accName.trim()) return
    addAccount({
      name: accName,
      type: accType,
      initialBalance: parseFloat(accBalance) || 0,
      currency: 'USD',
      color: accColor,
    })
    setAccName('')
    setShowAccountModal(false)
  }

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(txAmount)
    if (isNaN(amt) || amt <= 0) return
    if (!txAccountId) return

    addTransaction({
      type: txType,
      amount: amt,
      category: txCategory,
      description: txDesc,
      date: new Date().toISOString().split('T')[0],
      accountId: txAccountId,
      toAccountId: txType === 'TRANSFER' ? txToAccountId : null,
    })

    setTxAmount('')
    setTxDesc('')
    setShowTxModal(false)
  }

  const getAccountIcon = (type: AccountType) => {
    switch (type) {
      case 'CASH':
        return DollarSign
      case 'BANK':
        return Building2
      case 'EWALLET':
        return Smartphone
      case 'CREDIT_CARD':
        return CreditCard
      default:
        return Wallet
    }
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Finance Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Wallet className="w-7 h-7 text-emerald-600" /> Finance & Multi-Account Ledger
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Real-time balance auto-calculation across Cash, Bank, and E-Wallets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAccountModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-semibold text-xs shadow-xs transition"
          >
            <Plus className="w-4 h-4" /> Add Account
          </button>
          <button
            onClick={() => setShowTxModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-md shadow-emerald-600/20 transition"
          >
            <Plus className="w-4 h-4" /> Record Entry
          </button>
        </div>
      </div>

      {/* Net Worth Summary Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-slate-800 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
            Total Combined Net Worth
          </span>
          <h2 className="text-4xl font-extrabold text-white mt-1">
            ${getTotalNetWorth().toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>

        <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-white/20 pt-4 sm:pt-0 sm:pl-6 text-xs text-white/80">
          <div>
            <span className="text-white/70 block">Total Accounts</span>
            <span className="text-lg font-bold text-white">{accounts.length}</span>
          </div>
          <div>
            <span className="text-white/70 block">Ledger Records</span>
            <span className="text-lg font-bold text-white">{transactions.length}</span>
          </div>
        </div>
      </div>

      {/* ACCOUNTS & WALLETS CARDS */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          Accounts & Wallets
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {accounts.map((acc) => {
            const Icon = getAccountIcon(acc.type)
            const balance = getAccountBalance(acc.id)

            return (
              <div
                key={acc.id}
                className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-slate-300 transition shadow-xs space-y-4 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl text-white shadow-xs"
                      style={{ backgroundColor: acc.color }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{acc.name}</h3>
                      <p className="text-xs text-slate-500">{acc.type}</p>
                    </div>
                  </div>
                  {accounts.length > 1 && (
                    <button
                      onClick={() => deleteAccount(acc.id)}
                      className="text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs text-slate-500">Current Balance:</span>
                  <span className="text-xl font-extrabold text-slate-900">
                    ${balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* TRANSACTION LEDGER TABLE */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            Ledger History
          </h2>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200">
            {(['ALL', 'INCOME', 'EXPENSE', 'TRANSFER'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterType === type
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200/80 overflow-hidden shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Type</th>
                <th className="px-5 py-3.5">Category & Description</th>
                <th className="px-5 py-3.5">Account / Transfer</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Amount</th>
                <th className="px-4 py-3.5 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-400 italic">
                    No transactions matching filter.
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-5 py-4">
                      <div className="inline-flex items-center gap-1.5 font-bold">
                        {tx.type === 'INCOME' && (
                          <span className="p-1 rounded-lg bg-emerald-50 text-emerald-600">
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {tx.type === 'EXPENSE' && (
                          <span className="p-1 rounded-lg bg-rose-50 text-rose-600">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                          </span>
                        )}
                        {tx.type === 'TRANSFER' && (
                          <span className="p-1 rounded-lg bg-sky-50 text-sky-600">
                            <ArrowRightLeft className="w-3.5 h-3.5" />
                          </span>
                        )}
                        <span
                          className={
                            tx.type === 'INCOME'
                              ? 'text-emerald-600'
                              : tx.type === 'EXPENSE'
                              ? 'text-rose-600'
                              : 'text-sky-600'
                          }
                        >
                          {tx.type}
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="font-semibold text-slate-900 block">{tx.category}</span>
                      {tx.description && (
                        <span className="text-slate-500 text-[11px]">{tx.description}</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-700">
                      {tx.type === 'TRANSFER' ? (
                        <span className="flex items-center gap-1 font-medium text-sky-700">
                          {tx.accountName} → {tx.toAccountName}
                        </span>
                      ) : (
                        <span>{tx.accountName}</span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-slate-500">{tx.date}</td>

                    <td className="px-5 py-4 text-right font-bold text-sm">
                      <span
                        className={
                          tx.type === 'INCOME'
                            ? 'text-emerald-600'
                            : tx.type === 'EXPENSE'
                            ? 'text-rose-600'
                            : 'text-sky-600'
                        }
                      >
                        {tx.type === 'INCOME' ? '+' : tx.type === 'EXPENSE' ? '-' : ''}$
                        {Number(tx.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-center">
                      <button
                        onClick={() => deleteTransaction(tx.id)}
                        className="text-slate-400 hover:text-rose-600 transition"
                      >
                        <Trash2 className="w-4 h-4 mx-auto" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE ACCOUNT MODAL */}
      {showAccountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Add Account / Wallet</h3>
            <form onSubmit={handleCreateAccount} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Account Name</label>
                <input
                  type="text"
                  required
                  value={accName}
                  onChange={(e) => setAccName(e.target.value)}
                  placeholder="e.g. Schwab Savings or Crypto Wallet"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Account Type</label>
                  <select
                    value={accType}
                    onChange={(e) => setAccType(e.target.value as AccountType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    <option value="CASH">Cash on Hand</option>
                    <option value="BANK">Bank Account</option>
                    <option value="EWALLET">E-Wallet (PayPal, Venmo)</option>
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="INVESTMENT">Investment</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Initial Balance ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={accBalance}
                    onChange={(e) => setAccBalance(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Badge Color</label>
                <input
                  type="color"
                  value={accColor}
                  onChange={(e) => setAccColor(e.target.value)}
                  className="w-full h-10 rounded-xl bg-slate-50 border border-slate-300 p-1 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAccountModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE TRANSACTION MODAL */}
      {showTxModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Record Transaction Ledger Entry</h3>
            <form onSubmit={handleCreateTransaction} className="space-y-4">
              {/* Type selector */}
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Transaction Type</label>
                <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-slate-100 border border-slate-200">
                  {(['INCOME', 'EXPENSE', 'TRANSFER'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTxType(t)}
                      className={`py-2 rounded-lg text-xs font-bold transition ${
                        txType === t
                          ? t === 'INCOME'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : t === 'EXPENSE'
                            ? 'bg-rose-600 text-white shadow-xs'
                            : 'bg-sky-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={txCategory}
                    onChange={(e) => setTxCategory(e.target.value)}
                    placeholder="e.g. Salary, Food, Rent"
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">
                  {txType === 'TRANSFER' ? 'Source Account (From)' : 'Account'}
                </label>
                <select
                  value={txAccountId}
                  onChange={(e) => setTxAccountId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                >
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name} (${getAccountBalance(acc.id).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>

              {txType === 'TRANSFER' && (
                <div>
                  <label className="text-xs font-semibold text-slate-600 block mb-1">
                    Destination Account (To)
                  </label>
                  <select
                    value={txToAccountId}
                    onChange={(e) => setTxToAccountId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-900 focus:outline-none"
                  >
                    {accounts.map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} (${getAccountBalance(acc.id).toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">Description</label>
                <input
                  type="text"
                  value={txDesc}
                  onChange={(e) => setTxDesc(e.target.value)}
                  placeholder="Optional memo or receipt details"
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-2 text-sm text-slate-900 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTxModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md"
                >
                  Confirm Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
