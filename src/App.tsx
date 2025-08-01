import { BrowserRouter, Routes, Route } from "react-router-dom";
import WriteLetterPage from "./pages/MoaLetter/WriteLetterPage";
import LetterSavedPage from "./pages/MoaLetter/LetterSavedPage";
import SelectPhotoPage from './pages/MoaLetter/SelectPhotoPage';
import LetterPreviewPage from "./pages/MoaLetter/LetterPreviewPage";
import EnvelopeContent from "./components/moaletter/EnvelopeContent";
import AlbumGridPage from "./pages/MoaLetter/AlbumGridPage"; 
import RollingPaperGridPage from "./pages/MoaLetter/RollingPaperPage";
import ReceiptPage from "./pages/MoaLetter/ReceiptPage";
import LetterDetailPage from "./pages/MoaLetter/LetterDetailPage";

import { Navigate } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/moaletter/write" element={<WriteLetterPage />} />
        <Route path="/" element={<Navigate to="/moaletter/write" />} />
        <Route path="/moaletter/letter-saved" element={<LetterSavedPage />} />
        <Route path="/moaletter/select-photo" element={<SelectPhotoPage />} />
        <Route path="/moaletter/preview" element={<LetterPreviewPage />} />
        <Route path="/moaletter/envelope" element={<EnvelopeContent />} />
        <Route path="/moaletter/album/:albumName" element={<AlbumGridPage />} />
        <Route path="/moaletter/rolling-paper" element={<RollingPaperGridPage />} />
        <Route path="/moaletter/receipt" element={<ReceiptPage />} />
        <Route path="/moaletter/letter-detail" element={<LetterDetailPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
