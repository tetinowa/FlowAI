import { AISection } from "./_components/AISection";
import { Dashboard } from "./_components/Dashboard";
import FileUpload from "./_components/FileUpload";
import { GraphicSection } from "./_components/GraphicSection";
import { HeadSection } from "./_components/HeadSection";

/**
 * Renders the Finance page by composing the page header, dashboard, AI section, graphic section, and file upload.
 *
 * @returns The page's JSX element containing HeadSection, Dashboard, AISection, GraphicSection, and FileUpload components
 */
export default function Finance() {
  return (
    <div>
      <HeadSection />
      <Dashboard />
      <AISection />
      <GraphicSection />
      <FileUpload />

    </div>
  );
}
