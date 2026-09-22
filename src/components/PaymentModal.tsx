import React, { useState } from 'react';
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Lock,
  DollarSign,
  Download,
  Printer,
  Sparkles,
  Smartphone
} from 'lucide-react';
import { api } from '../services/api';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId?: string;
  amount: number;
  patientName: string;
  procedureName: string;
  onPaymentSuccess?: (txnId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  appointmentId,
  amount,
  patientName,
  procedureName,
  onPaymentSuccess
}) => {
  const [method, setMethod] = useState<'card' | 'apple_pay' | 'financing'>('card');
  const [cardNumber, setCardNumber] = useState<string>('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState<string>('12/28');
  const [cardCvc, setCardCvc] = useState<string>('842');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean>(false);
  const [transactionId, setTransactionId] = useState<string>('');

  if (!isOpen) return null;

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    const res = await api.processPayment({
      appointmentId,
      amount,
      paymentMethod: method === 'card' ? 'Visa' : method === 'apple_pay' ? 'Apple Pay' : '0% CareCredit Financing',
      cardLast4: '4242',
      patientName: patientName || 'Patient'
    });

    if (res.success && res.transactionId) {
      setTransactionId(res.transactionId);
      setPaymentSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess(res.transactionId);
    }
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg text-slate-900">
                Secure Dental Payment
              </h3>
              <p className="text-xs text-slate-400">256-Bit SSL Encrypted • PCI-DSS Compliant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 transition"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        {!paymentSuccess ? (
          <div className="space-y-5">
            {/* Amount Summary */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-400 uppercase font-semibold block">Procedure / Deposit</span>
                <span className="font-bold text-sm text-slate-900">{procedureName || 'Implant Consultation Deposit'}</span>
                <span className="text-xs text-slate-500 block">Patient: {patientName || 'Registered Patient'}</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 uppercase font-semibold block">Total Due</span>
                <span className="font-heading font-extrabold text-2xl text-teal-800">${amount}</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('card')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition ${
                  method === 'card'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CreditCard className="w-4 h-4 text-teal-700" />
                <span>Card</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('apple_pay')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition ${
                  method === 'apple_pay'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Smartphone className="w-4 h-4 text-teal-700" />
                <span>Apple / Google</span>
              </button>

              <button
                type="button"
                onClick={() => setMethod('financing')}
                className={`p-3 rounded-xl border flex flex-col items-center gap-1 text-xs font-bold transition ${
                  method === 'financing'
                    ? 'border-teal-600 bg-teal-50 text-teal-900 ring-2 ring-teal-500'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <DollarSign className="w-4 h-4 text-amber-600" />
                <span>0% Financing</span>
              </button>
            </div>

            {/* Method Inputs */}
            {method === 'card' && (
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Expiration</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">CVC Code</label>
                    <input
                      type="password"
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full p-3 rounded-xl border border-slate-300 text-xs font-bold text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {method === 'apple_pay' && (
              <div className="p-6 rounded-2xl bg-slate-900 text-white text-center space-y-2">
                <Smartphone className="w-8 h-8 text-teal-400 mx-auto" />
                <h4 className="font-bold text-sm">One-Touch Device Authentication</h4>
                <p className="text-xs text-slate-400">
                  Authorize payment using FaceID, TouchID, or your default Google Wallet.
                </p>
              </div>
            )}

            {method === 'financing' && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                <div className="flex items-center gap-1.5 font-bold">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>CareCredit & Proceed Dental Financing (0% APR)</span>
                </div>
                <p className="leading-relaxed">
                  Pay as little as <strong>${Math.round(amount / 12)}/month</strong> with zero interest for 12 months. Pre-approved without impacting credit scores.
                </p>
              </div>
            )}

            {/* Pay Button */}
            <button
              id="confirm-pay-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleProcessPayment}
              className="w-full py-3.5 px-4 rounded-xl bg-teal-700 hover:bg-teal-800 text-white font-bold text-sm shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <span>Authorizing Payment...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Authorize & Pay ${amount}</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Receipt Screen */
          <div className="text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Payment Succeeded</span>
              <h3 className="font-heading font-extrabold text-2xl text-slate-900">
                Official Clinic Receipt
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Transaction ID: <strong>{transactionId}</strong>
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Paid Amount:</span>
                <span className="font-bold text-slate-900">${amount}.00 USD</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Payment Method:</span>
                <span className="text-slate-800 capitalize">{method.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Clinic:</span>
                <span className="text-slate-800">Orvexa Dental & Medical Center</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Date:</span>
                <span className="text-slate-800">{new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50 flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Receipt</span>
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold shadow"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
