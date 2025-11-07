const API_BASE = '/api';

export async function uploadFile(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      let errorMessage = 'Upload failed';
      try {
        const error = await response.json();
        errorMessage = error.error || errorMessage;
      } catch (jsonError) {
        // If response is not JSON, try to get text
        const text = await response.text();
        errorMessage = text || `Server error: ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse success response as JSON:', jsonError);
      throw new Error('Server returned invalid response');
    }

    console.log('Upload successful:', data);
    return data;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

export async function downloadTrack(trackType, jobId) {
  try {
    const response = await fetch(`${API_BASE}/download/${trackType}/${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Download failed');
    }

    const blob = await response.blob();
    return blob;
  } catch (error) {
    throw error;
  }
}

export async function getJobStatus(jobId) {
  try {
    const response = await fetch(`${API_BASE}/status/${jobId}`);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Status check failed');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}
