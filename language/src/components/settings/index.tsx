import ThemeContrast from './ThemeContrast';
import ThemeRtlLayout from './ThemeRtlLayout';
import ThemeColorPresets from './ThemeColorPresets';
import ThemeLocalization from './ThemeLocalization';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default function ThemeSettings({ children }: Props) {
  return (
    <ThemeColorPresets>
      <ThemeContrast>
        <ThemeLocalization>
          <ThemeRtlLayout>
            {children}
          </ThemeRtlLayout>
        </ThemeLocalization>
      </ThemeContrast>
    </ThemeColorPresets>
  );
}
