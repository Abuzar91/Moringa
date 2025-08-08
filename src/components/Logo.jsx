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
    <div className={`flex items-center space-x-3 ${className}`}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative"
      >
        <img
          src="https://res.cloudinary.com/diwerulix/image/upload/v1754657972/MoringaLogo_horizontal_color_qs4bhz.png"
          alt="Eleve Logo"
          className={`${currentSize.container} w-auto object-contain`}
        />
      </motion.div>
      
      {showText && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className={`${currentSize.text} font-bold font-display bg-gradient-to-r from-primary-600 to-primary-700 bg-clip-text text-transparent tracking-tight`}
        >
          Eleve
        </motion.span>
      )}
    </div>
  );
};

export default Logo;