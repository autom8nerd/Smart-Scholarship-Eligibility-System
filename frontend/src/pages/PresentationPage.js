import React from 'react';
import { useNavigate } from 'react-router-dom';
import PresentationViewer from '../components/PresentationViewer';

const PresentationPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <PresentationViewer
        onClose={() => navigate('/presentation-landing')}
      />
    </div>
  );
};

export default PresentationPage;
