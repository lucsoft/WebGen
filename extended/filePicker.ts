export async function createFilePicker(accept: string): Promise<File> {
    const fileSignal = Promise.withResolvers<File>();
    const input = document.createElement("input");
    input.type = "file";
    input.hidden = true;
    input.accept = accept;

    input.addEventListener("change", () => {
        fileSignal.resolve(Array.from(input.files ?? [])[ 0 ]!);
    });

    input.showPicker();
    return await fileSignal.promise;
}
