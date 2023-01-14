<script setup>
import {TrashOutline, CloseOutline, ApertureOutline, ChevronBackOutline, ChevronForwardOutline} from '@vicons/ionicons5'
import {computed, inject, onMounted, ref} from "vue";
import {useAuthStore} from "@/stores/authStore.js";
import {storage} from "@/plugins/firebase.js";
import {ref as storageRef, uploadBytes, listAll, getDownloadURL, getStorage, list, deleteObject} from "firebase/storage";
import {onClickOutside, useIdle} from '@vueuse/core'

const imageModal = ref();
const notification = inject("notification");

const userStore = useAuthStore();

const imagePreview = ref(null);
const imageFile = ref(null);
const imageFileName = ref(null);
const imageFolder = ref("/images/");
const fileList = storageRef(storage, imageFolder.value);
const files = ref([]);
const loading = ref(false);
const inputRef = ref();
const modalContainer = ref();

const nextPageToken = ref(null);
const moreFiles = ref([]);
const maxResults = ref(4);
const listFiles = () => {
  loading.value = true;
  list(storageRef(storage, imageFolder.value), {maxResults: maxResults.value})
      .then(async (res) => {
        res.prefixes.forEach((folderRef) => {
          // All the prefixes under listRef.
          // You may call listAll() recursively on them.
          console.log(folderRef);
        });
        res.items.forEach((itemRef) => {
          getDownloadURL(storageRef(storage, itemRef.fullPath)).then((url) => {
            files.value.push({
              url: url,
              path: itemRef.fullPath
            })
          });
        });
        setTimeout(() => {
          loading.value = false;
        }, 500)
        if (res.nextPageToken) {
          nextPageToken.value = await list(storageRef(storage, imageFolder.value), {
            maxResults: maxResults.value,
            pageToken: res.nextPageToken,
          })
          nextPageToken.value.items.forEach((itemRef) => {
            getDownloadURL(storageRef(storage, itemRef.fullPath)).then((url) => {
              moreFiles.value.push({
                url: url,
                path: itemRef.fullPath
              })
            });
          });
        }
      }).catch((error) => {
        notification.value = {
          type: "error",
          message: error.message
        }
  });
}

onMounted(() => {
  listFiles()
});
const changeImage = (e) => {
  const file = e.target.files[0];
  if (file && imageFile.value === null) {
    imageFile.value = file;
    imageFileName.value = file.name;
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const upload = async () => {
  const fileRef = storageRef(storage, `${imageFolder.value + Math.random().toString(36).substring(2, 15)}.${imageFile.value.name.split(".").pop()}`);
  uploadBytes(fileRef, imageFile.value).then((snapshot) => {
    console.log('Uploaded a blob or file!');
  }).then(() => {
    notification.value = {
      message: "Image uploaded successfully",
      type: "success",
      show: true,
    };
    files.value.push({
      path: fileRef.fullPath,
      url: imagePreview.value
    });
    imagePreview.value = null;
    imageFile.value = null;
    imageFileName.value = null;
  }).catch((error) => {
    notification.value = {
      message: error.message,
      type: "error",
      show: true,
    };
  });
};

function deleteFile(file) {
  const path = storageRef(storage, file);
  deleteObject(path).then(() => {
    notification.value = {
      message: "Image deleted successfully",
      type: "success",
      show: true,
    };
    files.value = files.value.filter((item) => item.path !== file);
  }).catch((error) => {
    notification.value = {
      message: error.message,
      type: "error",
      show: true,
    };
  });
}

/* Modal Start */

const modalActive = ref(false)
const activeImage = ref(null)
const openModal = (url) => {
  modalActive.value = true
  activeImage.value = url
}

function closeModal(){
  modalActive.value = false
  setTimeout(() => {
    activeImage.value = null
  }, 500)
}

onClickOutside(imageModal, (event) => {
  if (modalActive.value) {
    closeModal()
  }
})

/* Modal End */

const nextImage = () => {
  const index = files.value.findIndex((item) => item.url === activeImage.value)
  if (index === files.value.length - 1) {
    activeImage.value = files.value[0].url
  } else {
    activeImage.value = files.value[index + 1].url
  }
}

const prevImage = () => {
  const index = files.value.findIndex((item) => item.url === activeImage.value)
  if (index === 0) {
    activeImage.value = files.value[files.value.length - 1].url
  } else {
    activeImage.value = files.value[index - 1].url
  }
}

function removeImage() {
  imagePreview.value = null;
  imageFile.value = null;
  imageFileName.value = null;
}

function changeFolder(folder) {
  imageFolder.value = folder
  files.value = []
  moreFiles.value = []
  listFiles()
  nextPage()
}

const metaInfo = computed(() => {
  return {
    title: "Homepage",
    description: "Upload images to firebase storage",
  }
});

async function nextPage() {
  files.value.push(...moreFiles.value)
  if (nextPageToken.value?.nextPageToken) {
    moreFiles.value = []
    nextPageToken.value = await list(storageRef(storage, imageFolder.value), {
      maxResults: maxResults.value,
      pageToken: nextPageToken.value.nextPageToken,
    })
    nextPageToken.value.items.forEach((itemRef) => {
      getDownloadURL(storageRef(storage, itemRef.fullPath)).then((url) => {
        moreFiles.value.push({
          url: url,
          path: itemRef.fullPath
        })
      });
    });
  }else {
    nextPageToken.value = null
  }
}

</script>

<template>
  <teleport to="head">
    <MetaInfo :meta="metaInfo"/>
  </teleport>
  <div class="space-y-3">
    <div class="card p-4 w-full bg-base-300 text-base-content flex-1 items-center justify-center gap-4">
      <img v-if="imageFile" :src="imagePreview" class="h-20"/>
      <div class="flex items-center justify-center gap-4">
        <div class="btn btn-primary btn-sm" @click="inputRef.click()">
          <span>{{ imageFileName ?? "Choose an image" }}</span>
          <input type="file" ref="inputRef" @input="imageFile" @change="changeImage" class="hidden"/>
        </div>
<!--        <input type="file" @input="imageFile" class="file-input file-input-sm w-full max-w-xs" @change="changeImage"/>-->
        <button :disabled="!imageFile" @click="upload" class="btn btn-success btn-sm">Upload</button>
        <button v-if="imageFile" @click="removeImage" class="btn btn-error btn-sm btn-circle">
          <CloseOutline class="h-4" />
        </button>
      </div>
    </div>

    <div class="transition-all duration-500 p-4 w-full flex items-center justify-end gap-3">
      <button @click="changeFolder('/images/')" class="btn btn-xs" :class="{'btn-primary': imageFolder === '/images/'}">People</button>
      <button @click="changeFolder('/places/')" class="btn btn-xs" :class="{'btn-primary': imageFolder === '/places/'}">Places</button>
    </div>

    <div class="card p-4 w-full bg-base-300 text-base-content">
      <div v-if="!loading" class="grid" :class="{'md:grid-cols-4 gap-4': files.length > 0, 'grid-cols-1': files.length === 0}">
        <transition-group name="list">
          <div v-for="(file, index) in files" v-if="files.length > 0" :key="index" class="mx-auto indicator z-0">
            <img loading="lazy" :src="file.url" class="h-40 rounded-lg cursor-pointer grayscale hover:grayscale-0 transition-all duration-500 scale-95 hover:scale-100" @click="openModal(file.url)"/>
            <div class="indicator-item">
              <button @click="deleteFile(file.path)" class="btn btn-error btn-xs btn-circle">
                <TrashOutline class="h-3"/>
              </button>
            </div>
          </div>
          <div v-else class="flex items-center justify-center">
            <span class="text-lg text-gray-500 font-semibold">No image found</span>
          </div>
        </transition-group>
      </div>
      <div v-else>
        <div class="flex items-center justify-center">
          <ApertureOutline class="h-10 animate-spin" />
          <span class="ml-2">Loading...</span>
        </div>
      </div>
      <div v-if="nextPageToken" class="flex items-center justify-center mt-5">
        <button @click="nextPage" class="btn btn-primary btn-sm">Load more</button>
      </div>
    </div>
  </div>
  <teleport to="body">
    <transition name="fade" mode="out-in">
      <div v-show="modalActive"
           ref="modalContainer"
           tabindex="0"
           @keyup.esc="closeModal"
           @keyup.left="prevImage"
           @keyup.right="nextImage" class="overflow-y-hidden bg-slate-800 bg-opacity-50 flex justify-center items-center fixed top-0 right-0 bottom-0 left-0">
        <div ref="imageModal">
          <div class="flex items-center justify-center gap-3 mt-2 p-2">
            <button class="btn btn-ghost btn-sm md:btn-md" @click="prevImage">
              <ChevronBackOutline class="md:h-10 h-8 text-base-100"/>
            </button>
            <div class="relative">
              <img :src="activeImage" class="p-3 w-full transition-all duration-300"/>
            </div>
            <button class="btn btn-ghost btn-sm md:btn-md" @click="nextImage">
              <ChevronForwardOutline class="md:h-10 h-8 text-base-100"/>
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
}
</style>