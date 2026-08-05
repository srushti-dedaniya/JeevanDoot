import Sidebar from './Sidebar';
import Header from './Header';

/**
 * DashboardLayout - wraps admin & doctor dashboards with a shared shell.
 * Props:
 *  - sidebarProps, headerProps
 *  - children (page content)
 */
export default function DashboardLayout({
  sidebarProps = {},
  headerProps = {},
  contentClassName = 'p-10 space-y-10',
  children,
}) {
  return (
    <div className="bg-background min-h-screen">
      <Sidebar {...sidebarProps} />
      <main className="ml-72 min-h-screen">
        <Header {...headerProps} />
        <div className={contentClassName}>{children}</div>
      </main>
    </div>
  );
}
