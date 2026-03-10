export const EdrixLogo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className="relative w-6 h-6 flex-shrink-0">
      <div
        className="w-full h-full border-2 border-primary rotate-45"
        style={{ boxShadow: '0 0 12px hsl(184 100% 49% / 0.4)' }}
      />
    </div>
    {!collapsed && (
      <span className="font-syne font-bold text-primary tracking-[0.2em] text-lg">
        EDRIX
      </span>
    )}
  </div>
);
