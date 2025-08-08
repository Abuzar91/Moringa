import { motion } from 'framer-motion';

const Logo = ({ size = 'md', className = '', showText = false, variant = 'default' }) => {
  const sizes = {
    sm: { container: 'h-8', text: 'text-lg' },
    md: { container: 'h-10', text: 'text-xl' },
    lg: { container: 'h-16', text: 'text-3xl' },
    xl: { container: 'h-20', text: 'text-4xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <img
          src="/MoringaLogo_horizontal_color.png"
          alt="Eleve Logo"
          className={`${currentSize.container} w-auto object-contain`}
        />
      </motion.div>
    </div>
  );
};

export default Logo;