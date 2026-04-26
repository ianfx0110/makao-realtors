import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Home, Users, Wallet, Edit2, Trash2 } from 'lucide-react';
import { mockProperties } from '../../data/mockData';

export const LandlordPortfolio = () => {
  const myProperties = mockProperties.filter(p => p.status === 'rent');

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-display">Landlord <span className="text-brand-accent">Portfolio</span></h1>
          <p className="text-stone-500">Manage your rental units and tenant income.</p>
        </div>
        <Link 
          to="/create-listing" 
          className="btn-pill bg-brand-primary text-white hover:bg-brand-accent flex items-center gap-2"
        >
          <Plus size={14} /> Add Property
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bento-card flex items-center gap-4">
          <Home className="text-brand-accent" />
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400">Total Units</span>
            <p className="text-xl font-display">{myProperties.length} Managed</p>
          </div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <Users className="text-blue-500" />
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400">Active Tenants</span>
            <p className="text-xl font-display">{(myProperties.length * 0.8).toFixed(0)} Occupied</p>
          </div>
        </div>
        <div className="bento-card flex items-center gap-4">
          <Wallet className="text-green-500" />
          <div>
            <span className="text-[10px] uppercase font-bold text-stone-400">Est. Revenue</span>
            <p className="text-xl font-display">KES 420K</p>
          </div>
        </div>
      </div>

      <div className="bento-card p-0 overflow-hidden">
        <div className="p-6 border-b border-stone-100 bg-white">
          <h3 className="font-bold text-lg">My Rental Listings</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <tbody className="divide-y divide-stone-50">
              {myProperties.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img src={p.images[0]} alt="" className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="text-sm font-bold text-brand-primary">{p.title}</div>
                        <div className="text-[10px] text-stone-400 uppercase font-bold">{p.neighborhood}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] font-bold uppercase text-brand-accent bg-brand-accent/5 px-2 py-1 rounded">
                      KES {p.price.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 text-stone-400 hover:text-brand-primary hover:bg-stone-100 rounded-lg transition-all">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
