import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  PhoneCall,
  Mail,
} from 'lucide-react';
import { teamMembers } from '@/assets/data';

export default function Team() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="py-16 bg-gradient-to-br from-[#fff3e6] to-[#fef6f0] text-center">
      <h2 className="text-4xl font-bold text-[#800020]">Meet the Team</h2>
      <p className='text-3xl font-bold text-[#800020] mb-12'>Group 1 G-Class L300</p>
      <div className="grid gap-10 px-6 sm:grid-cols-2 md:grid-cols-3">
        {teamMembers.map((member, idx) => (
          <motion.div
            key={idx}
            onClick={() => setSelected(member)}
            className="cursor-pointer bg-white rounded-3xl shadow-2xl overflow-hidden p-6 group hover:shadow-[#800020]/50 border-t-4 border-[#FFC107] hover:scale-[1.03] transition-transform duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <img
              src={member.image}
              alt={member.name}
              className="w-28 h-28 mx-auto rounded-full object-cover border-4 border-[#ffcc00] group-hover:rotate-3 transition-transform duration-300"
            />
            <h3 className="mt-4 text-xl font-bold text-[#800020]">{member.name}</h3>
            <p className="text-sm text-gray-600">{member.role}</p>
            {/* Display index number if available */}
            {member.index && <p className="text-sm text-gray-400">Index: {member.index}</p>}
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setSelected(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl p-8 w-[90%] max-w-lg shadow-2xl"
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <img
                src={selected.image}
                alt={selected.name}
                className="w-24 h-24 mx-auto rounded-full object-cover border-4 border-[#ffcc00]"
              />
              <h3 className="mt-4 text-2xl font-bold text-[#800020]">{selected.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{selected.role}</p>
              <p className="text-gray-700 text-sm mb-4">{selected.bio}</p>

              <div className="flex justify-center gap-6 mt-4 text-[#800020] text-xl">
                {selected.github && (
                  <a href={selected.github} target="_blank" rel="noopener noreferrer">
                    <Github className="w-6 h-6 hover:scale-125 transition-transform" />
                  </a>
                )}
                {selected.linkedin && (
                  <a href={selected.linkedin} target="_blank" rel="noopener noreferrer">
                    <Linkedin className="w-6 h-6 hover:scale-125 transition-transform" />
                  </a>
                )}
                {selected.whatsapp && (
                  <a href={selected.whatsapp} target="_blank" rel="noopener noreferrer">
                    <PhoneCall className="w-6 h-6 hover:scale-125 transition-transform" />
                  </a>
                )}
                {selected.email && (
                  <a href={selected.email}>
                    <Mail className="w-6 h-6 hover:scale-125 transition-transform" />
                  </a>
                )}
              </div>

              <button
                onClick={() => setSelected(null)}
                className="mt-6 bg-[#ffcc00] hover:bg-[#e6b800] text-[#800020] px-6 py-2 rounded-full font-semibold transition duration-300"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
