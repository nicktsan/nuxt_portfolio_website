<script setup>
// import { ref } from 'vue';
const modalActive = ref(null);
const toggleModal = () => {
  modalActive.value = !modalActive.value;
}
const runtimeConfig  = useRuntimeConfig();
const form = ref({
  access_key: runtimeConfig.public.WEBTHREEFORM_PUBLIC_ACCESS_KEY,
  subject: "New Submission from Web3Forms",
  name: "",
  email: "",
  message: "",

});

const result = ref("");
const status = ref("");

const submitForm = async () => {
  result.value = "Please wait...";
  console.log(form)
  try {
    const response = await $fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: form.value,
    });

    console.log(response); // You can remove this line if you don't need it
    
    result.value = response.message;

    if (response.status === 200) {
      status.value = "success";
    } else {
      console.log(response); // Log for debugging, can be removed
      status.value = "error";
    }
    toggleModal()
  } catch (error) {
    console.log(error); // Log for debugging, can be removed
    status.value = "error";
    result.value = "Something went wrong!";
  } finally {
    // Reset form after submission
    form.value.name = "";
    form.value.email = "";
    form.value.message = "";

    // Clear result and status after 5 seconds
    setTimeout(() => {
      result.value = "";
      status.value = "";
    }, 5000);
  }
};
</script>
<template>
  <!-- <form @submit.prevent="submitForm">
    <input type="text" name="name" v-model="form.name"/>
    <input type="email" name="email"  v-model="form.email"/>
    <textarea name="message" v-model="form.message"></textarea>
    <button type="submit">Send Message</button>
  </form> -->
  <div class="flex items-center min-h-screen bg-white dark:bg-gray-900">
    <div class="container mx-auto">
      <div class="max-w-xl mx-auto my-10 bg-white p-5 rounded-md shadow-sm">
        <div class="text-center">
          <h1 class="my-3 text-3xl font-semibold text-gray-700 dark:text-gray-200">
            Contact Me
          </h1>
          <p class="text-gray-400 dark:text-gray-400">
            Fill up the form below to send us a message.
          </p>
        </div>
        <div class="m-7">
          <!-- <form action="https://api.web3forms.com/submit" method="POST" id="form" class="needs-validation" novalidate> -->
            <form @submit.prevent="submitForm" @keydown.enter="$event.preventDefault()" id="form" class="group" novalidate>
            <!-- <input type="hidden" name="access_key" :value=webThreeFormPublicAccessKey /> -->
            <!-- <input type="hidden" name="subject" value="New Submission from Web3Forms" /> -->
            <!-- <input type="checkbox" name="botcheck" id="" style="display: none;" /> -->

            <div class="flex mb-6 space-x-4">
              <div class="w-full">
                <label for="name" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Name</label>
                <!-- <input type="text" name="name" id="name" placeholder="John" required class="w-full px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" /> -->
                <input type="text" name="name" v-model="form.name" id="name" placeholder="Your name" 
                required 
                pattern=".*[^\s]+.*"
                class="invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 w-full peer px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
                <div class="hidden text-red-400 text-sm mt-1 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                  Please provide your name.
                </div>
              </div>
              <!-- <div class="w-full md:w-1/2">
                <label for="lname" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Last Name</label>
                <input type="text" name="last_name" id="lname" placeholder="Doe" required class="w-full px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
                <div class="empty-feedback hidden invalid-feedback was-validated:placeholder-shown:invalid:block text-red-400 text-sm mt-1">
                  Please provide your last name.
                </div>
              </div> -->
            </div>

            <div class="flex mb-6 space-x-4">
              <div class="w-full">
                <label for="email" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Email Address</label>
                <!-- <input type="email" name="email" id="email" placeholder="you@company.com" required class="w-full px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" /> -->
                <input type="email" name="email" v-model="form.email" id="email" placeholder="you@company.com" required 
                pattern="[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$"
                class="invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 w-full peer px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />
                <div class="hidden text-red-400 text-sm mt-1 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                  Please provide a valid email address.
                </div>
              </div>

              <!-- <div class="w-full md:w-1/2">
                <label for="phone" class="block text-sm mb-2 text-gray-600 dark:text-gray-400">Phone Number</label>
                <input type="text" name="phone" id="phone" placeholder="+1 (555) 1234-567" required class="w-full px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" />

                <div class="empty-feedback hidden invalid-feedback text-red-400 text-sm mt-1">
                  Please provide your phone number.
                </div>
              </div> -->
            </div>
            <div class="mb-6">
              <label for="message" class="block mb-2 text-sm text-gray-600 dark:text-gray-400">Your Message</label>
              <!-- <textarea rows="5" name="message" id="message" placeholder="Your Message" class="w-full px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" required></textarea> -->
              <textarea rows="5" name="message"  v-model="form.message" id="message" placeholder="Your Message" 
              class="invalid:[&:not(:placeholder-shown):not(:focus)]:border-red-500 peer w-full px-3 py-2 placeholder-gray-300 border-2 border-gray-200 rounded-md focus:outline-none focus:ring focus:ring-indigo-100 focus:border-indigo-300" 
              required></textarea>
              <div class="hidden text-red-400 text-sm mt-1 peer-[&:not(:placeholder-shown):not(:focus):invalid]:block">
                Please enter your message.
              </div>
            </div>
            <div class="mb-6">
              <!-- <button type="submit" 
              class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md focus:bg-indigo-600 focus:outline-none group-invalid:pointer-events-none group-invalid:opacity-30 ">
                Send Message
              </button> -->
              <button type="submit" 
                class="w-full px-3 py-4 text-white bg-indigo-500 rounded-md group-invalid:pointer-events-none group-invalid:opacity-30 ">
                Send Message
              </button>
            </div>
            <p class="text-base text-center text-gray-400" id="result"></p>
          </form>
        </div>
      </div>
    </div>
  </div>
  <BaseModal :modalActive="modalActive" @close-modal="toggleModal">
    <div class="text-black">
      <h1 class="text-2xl mb-1">Email Status</h1>
      <p class="mb-4">
        Post response
      </p>
    </div>
  </BaseModal>
</template>