export const getColorVars = (newColors) => {
  const cssVariables = newColors
    ? `  
    :root {   
      --background-color: ${newColors.bg.background};  
      --color-primary: ${newColors.bg.primary};  
      --color-secondary: ${newColors.bg.secondary};  
      --color-accent: ${newColors.bg.accent};  
      --color-dark: ${newColors.bg.dark};  
      --color-light: ${newColors.bg.light};  
      --text-primary: ${newColors.text.primary};  
      --text-secondary: ${newColors.text.secondary};  
      --text-accent: ${newColors.text.accent};  
      --text-dark: ${newColors.text.dark};  
      --text-light: ${newColors.text.light};  
      --gradient-primary: linear-gradient(135deg, var(--color-primary), var(--color-secondary));  
      --gradient-accent: linear-gradient(135deg, var(--color-primary) 0%, transparent 100%);  
      --overlay-light: rgba(255, 255, 255, 0.95);  
      --overlay-dark: rgba(0, 0, 0, 0.1);  
      --overlay-glass: rgba(255, 255, 255, 0.1);  
    }`
    : "";
  return cssVariables;
};
