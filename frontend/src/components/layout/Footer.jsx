import React from 'react'
import { Facebook, Twitter, Linkedin, Mail } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-accent-900 text-white border-t border-accent-800 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">GC</span>
              </div>
              <h3 className="font-bold">GreenCollect</h3>
            </div>
            <p className="text-sm text-accent-300">
              Plateforme intelligente pour une gestion optimale des déchets.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm text-accent-300">
              <li><a href="#" className="hover:text-primary-400 transition">Caractéristiques</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Tarification</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">API</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Légal</h4>
            <ul className="space-y-2 text-sm text-accent-300">
              <li><a href="#" className="hover:text-primary-400 transition">Conditions</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Confidentialité</a></li>
              <li><a href="#" className="hover:text-primary-400 transition">Cookies</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-accent-300">
                <Mail className="w-4 h-4" />
                contact@greencollect.com
              </li>
              <li className="flex gap-3">
                <a href="#" className="text-accent-400 hover:text-primary-400 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-accent-400 hover:text-primary-400 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-accent-400 hover:text-primary-400 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-accent-800 pt-8">
          <p className="text-sm text-accent-400 text-center">
            © 2024 GreenCollect. Tous droits réservés. Conçu pour l'environnement.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
