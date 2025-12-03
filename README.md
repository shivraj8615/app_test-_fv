# 📱 Manuals App Generator

This project allows you to generate a custom Android APK containing specific PDF manuals for different clients.

## 🚀 Quick Start (Daily Usage)

### 1. Add Manuals
Place your PDF files in the `assets/pdfs/` folder.
*   **Note**: The app automatically detects these files.
*   *Optional*: You can also update `src/data/manuals.json` if you want to customize titles or icons, but it's not strictly required if the app logic supports dynamic loading (currently it uses the JSON).

### 2. Build APK
Run the build script:
```bash
./build_release.sh
```

### 3. Get Your App
*   **Success**: You will see `✅ Build Successful!`
*   **Output**: The APK is located at `dist/manuals-app.apk`
*   **Cleanup**: The script **automatically deletes** the PDFs from `assets/pdfs/` after a successful build so you are ready for the next client.

---

## ⚡ Build Features

*   **Incremental Builds**: The script is smart! 
    *   **First Run**: It generates the full Android project (takes ~5-10 mins).
    *   **Subsequent Runs**: It reuses the existing project and only updates the assets (takes ~1-2 mins).
*   **Auto-Cleanup**: `dist/` folder is cleaned before every build to prevent conflicts.
*   **Local SDK**: Uses a local Android SDK to avoid messing with your system settings.

---

## 🛠️ One-Time Setup (First Run Only)

If you are setting this up on a new machine, follow these steps:

1.  **Install Node.js & Java**:
    *   Ensure you have Node.js (LTS) and Java (JDK 17) installed.

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Setup Android SDK**:
    We have a script to set up a local Android SDK for you, so you don't need Android Studio.
    ```bash
    chmod +x setup_sdk.sh
    ./setup_sdk.sh
    ```

4.  **Make Build Script Executable**:
    ```bash
    chmod +x build_release.sh
    ```

---

## 🔧 Advanced Usage

### Changing App Name/Icon
If you need to change the App Name or Icon for a specific client:
1.  Edit `app.json`.
2.  **Important**: You must delete the cached Android project to apply these changes:
    ```bash
    rm -rf android
    ```
3.  Run `./build_release.sh` again.

### Development Mode
To run the app locally for testing without building an APK:
```bash
npx expo start
```
*   Press `a` to run on an Android Emulator (if configured).
*   Press `w` to run in the web browser.

---

## 📂 Project Structure

*   `assets/pdfs/`: **(Action Required)** Put client PDFs here.
*   `dist/`: **(Output)** Final APK appears here.
*   `src/`: Source code for the app.
*   `build_release.sh`: Main build script.
*   `setup_sdk.sh`: SDK setup script.
